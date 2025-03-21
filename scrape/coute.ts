import * as fs from 'fs';
import * as path from 'path';

const inputDir = 'profile-links'; // Directory containing the JSON files

const schools = ["Concordia", "McGill"];
const allUrls = new Set();
const schoolCounts = { Concordia: new Set(), McGill: new Set() };

// Function to extract and store unique LinkedIn URLs from a file
const processFile = (filePath) => {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        if (!Array.isArray(data)) {
            console.warn(`Skipping ${filePath}, not an array.`);
            return;
        }

        for (const person of data) {
            if (person.linkedinUrl) {
                allUrls.add(person.linkedinUrl);

                for (const school of schools) {
                    if (filePath.includes(school)) {
                        schoolCounts[school].add(person.linkedinUrl);
                    }
                }
            }
        }
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
    }
};

// Read all JSON files in the directory
fs.readdirSync(inputDir).forEach(file => {
    if (file.endsWith('.json')) {
        processFile(path.join(inputDir, file));
    }
});

// Print results
console.log(`Unique LinkedIn URLs for Concordia: ${schoolCounts.Concordia.size}`);
console.log(`Unique LinkedIn URLs for McGill: ${schoolCounts.McGill.size}`);
console.log(`Total unique LinkedIn URLs: ${allUrls.size}`);
// print all urls to a file
// fs.writeFileSync('all-urls.json', JSON.stringify(Array.from(allUrls), null, 2));
