import express, { Request, Response } from "express";
import cors from "cors";
import { PassThrough } from "stream";
import { LinkedInScraper } from "./LinkedInScraper";
import { ProfileConfig } from "./Models";

const app = express();
const PORT = 3050;

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize the LinkedIn scraper on server startup
let scraper: LinkedInScraper;

(async () => {
    try {
        scraper = new LinkedInScraper();
        await scraper.init();
        console.log("LinkedIn Scraper initialized successfully.");
    } catch (error) {
        console.error("Failed to initialize LinkedIn Scraper:", error);
    }
})();

// Endpoint for streaming LinkedIn profile data
app.post("/get-profile", async (req: Request, res: Response): Promise<void> => {
    const { linkedinUrl, acceptedSchools } = req.body;

    if (!linkedinUrl) {
        res.status(400).json({ error: "The 'linkedinUrl' field is required." });
        return;
    }

    // Set response headers for streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = new PassThrough();
    stream.pipe(res);

    try {
        stream.write(`Getting the profile \n`);

        const config = new ProfileConfig();
        config.scrapeExperience = false;
        config.scrapeProjects = false;
        config.scrapeHonors = false;
        stream.write(`Admiring your profile \n`);
        stream.write(`Checking if you can add your profile.\n`);
        const profileData = await scraper.getProfile(linkedinUrl, config);

        // Validate the user's educational background if an accepted school list is provided
        if (acceptedSchools && acceptedSchools.length > 0) {
            const userSchools = profileData.educations?.map((edu) => edu.school) || [];
            const isAccepted = userSchools.some((school) => acceptedSchools.includes(school));

            if (!isAccepted) {
                stream.write(`Sorry but you need to have studied in ${acceptedSchools.join(", ")} to add your profile.\n`);
                stream.end();
                return;
            }

            stream.write(`Looks good. Proceeding with further data extraction.\n`);
        } else {
            stream.write(`No school restrictions provided. Proceeding with the profile scraping process.\n`);
        }

        // Extracting work experience
        stream.write(`Retrieving work experience details.\n`);
        config.scrapeName = false;
        config.scrapeTitle = false;
        config.scrapeLocation = false;
        config.scrapePicture = false;
        config.scrapeExperience = true;
        config.scrapeEducation = false;
        config.scrapeProjects = false;
        config.scrapeHonors = false;
        profileData.experiences = (await scraper.getProfile(linkedinUrl, config)).experiences;

        // Extracting projects
        stream.write(`Retrieving project details.\n`);
        config.scrapeName = false;
        config.scrapeTitle = false;
        config.scrapeLocation = false;
        config.scrapePicture = false;
        config.scrapeExperience = false;
        config.scrapeEducation = false;
        config.scrapeProjects = true;
        config.scrapeHonors = false;
        profileData.projects = (await scraper.getProfile(linkedinUrl, config)).projects;

        // Extracting honors and awards
        stream.write(`Retrieving honors and awards.\n`);
        config.scrapeName = false;
        config.scrapeTitle = false;
        config.scrapeLocation = false;
        config.scrapePicture = false;
        config.scrapeExperience = false;
        config.scrapeEducation = false;
        config.scrapeProjects = false;
        config.scrapeHonors = true;
        profileData.honors = (await scraper.getProfile(linkedinUrl, config)).honors;

        // Completion message
        stream.write(`Thanks for adding your profile.\n`);
        stream.end();
        res.end(JSON.stringify({ success: true, profile: profileData }));
    } catch (error: any) {
        console.error(`Error encountered while processing profile ${linkedinUrl}:`, error);
        stream.write(`An error occurred during profile scraping: ${error.message}\n`);
        stream.end();
    }
});

// Start the API server
app.listen(PORT, () => {
    console.log(`API server is running on http://localhost:${PORT}`);
});
