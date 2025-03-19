import { LinkedInScraper } from "./LinkedInScraper";
import { PeopleSearchConfig } from "./Models";
import * as fs from 'fs';



// ------------------------------
//Schools
// ------------------------------
const schools = [
    {
        name: "Concordia",
        id: "163191"
    },
    {
        name: "McGill",
        id: "4855"
    }
];
// ------------------------------
// Companies
// ------------------------------
const companies = [
    { name: "Apple", id: "162479" },
    { name: "Nvidia", id: "3608" },
    { name: "Microsoft", id: "1035" },
    { name: "Google", id: "1337" },
    { name: "Amazon", id: "1586" },
    { name: "Bombardier", id: "2723" },
    { name: "Tesla", id: "15564" },
    { name: "Deloitte", id: "1038" },
    { name: "Visa", id: "2190" },
    { name: "Johnson & Johnson", id: "1207" },
    { name: "TD", id: "2775" },
    { name: "JPMorgan Chase", id: "1068" },
    { name: "Walmart", id: "2646" },
    { name: "Mastercard", id: "3015" },
    { name: "Procter & Gamble", id: "1116" },
    { name: "Chevron", id: "2192" },
    { name: "Home Depot", id: "1534" },
    { name: "Nestlé", id: "1393" },
    { name: "Pfizer", id: "1185" },
    { name: "L'Oréal", id: "1662" },
    { name: "Roche", id: "1602" },
    { name: "Novartis", id: "1406" },
    { name: "Mila - Quebec Artificial Intelligence Institute", id: "11409753" },
    { name: "McKinsey & Company", id: "1371" },
    { name: "Alibaba Group", id: "3839570" },
    { name: "Stealth Startup", id: "91313799" },
    { name: "ExxonMobil", id: "1689" },
    { name: "LVMH", id: "164788" },
    { name: "AbbVie", id: "1304385" },
    { name: "Oracle", id: "1028" },
    { name: "Cisco", id: "1063" },
    { name: "PepsiCo", id: "1431" },
    { name: "Merck", id: "1486" },
    { name: "Costco", id: "1635" },
    { name: "AstraZeneca", id: "1603" },
    { name: "Thermo Fisher Scientific", id: "3081" },
    { name: "Abbott", id: "1612" },
    { name: "Bank of America", id: "1123" },
    { name: "Nike", id: "2029" },
    { name: "Intel", id: "1053" },
    { name: "University of Toronto", id: "3660" },
    { name: "Comcast", id: "1703" },
    { name: "Université de Montréal", id: "166700" },
    { name: "IBM", id: "1009" },
    { name: "RBC", id: "1808" },
    { name: "Walt Disney", id: "1292" },
    { name: "McDonald's", id: "2677" },
    { name: "Medtronic", id: "1841" },
    { name: "Honeywell", id: "1344" },
    { name: "Amgen", id: "2068" },
    { name: "Citigroup", id: "11448" },
    { name: "Qualcomm", id: "2017" },
    { name: "Bristol-Myers Squibb", id: "1773" },
    { name: "AMD", id: "1497" },
    { name: "Texas Instruments", id: "1397" },
    { name: "Lockheed Martin", id: "1319" },
    { name: "Philip Morris International", id: "1912" },
    { name: "Shell", id: "1271" },
    { name: "Eli Lilly", id: "1663" },
    { name: "Schneider Electric", id: "2329" },
    { name: "Siemens", id: "1043" },
    { name: "Coca-Cola", id: "1694" },
    { name: "Novo Nordisk", id: "2227" },
    { name: "Netflix", id: "165158" },
    { name: "Salesforce", id: "3185" },
    { name: "Broadcom", id: "3072" },
    { name: "Accenture", id: "1033" },
    { name: "SAP", id: "1115" },
    { name: "ServiceNow", id: "29352" },
    { name: "Intuit", id: "1666" },
    { name: "Adobe", id: "1480" },
    { name: "Harvard University", id: "1646" },
    { name: "Shopify", id: "784652" },
    { name: "Palantir Technologies", id: "20708" },
    { name: "Workday", id: "17719" },
    { name: "Genetec", id: "22883" },
    { name: "Concordia University", id: "163191" },
    { name: "McGill University", id: "4855" },
    { name: "CAE", id: "4256" },
    { name: "Pratt & Whitney", id: "2425" },
    { name: "Morgan Stanley", id: "497017" },
    { name: "EY", id: "1073" },
];

(async () => {
    const scraper = new LinkedInScraper();
    await scraper.init();
    const outputDir = 'profile-links';

    for (const school of schools) {
        for (const company of companies) {
            const config: PeopleSearchConfig = {
                filters: {
                    keywords: "",
                    pastCompany: company.id,
                    schoolFilter: school.id,
                    origin: 'GLOBAL_SEARCH_HEADER',
                },
                pagesToScrape: 100,
                waitForTimeout: 1500,
            };

            console.log(`Searching for people from ${school.name} who worked at ${company.name}...`);
            const peopleSearch = await scraper.searchPeople(config);
            console.log(peopleSearch);

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir);
            }

            const filePath = `${outputDir}/peopleSearch_${school.name}_${company.name}_prev.json`;
            fs.writeFileSync(filePath, JSON.stringify(peopleSearch, null, 2));
        }
    }

    for (const school of schools) {
        for (const company of companies) {
            const config: PeopleSearchConfig = {
                filters: {
                    keywords: "",
                    currentCompany: company.id,
                    schoolFilter: school.id,
                    origin: 'GLOBAL_SEARCH_HEADER',
                },
                pagesToScrape: 100,
                waitForTimeout: 1500,
            };

            console.log(`Searching for people from ${school.name} who currently works at ${company.name}...`);
            const peopleSearch = await scraper.searchPeople(config);
            console.log(peopleSearch);

            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir);
            }

            const filePath = `${outputDir}/peopleSearch_${school.name}_${company.name}_curr.json`;
            fs.writeFileSync(filePath, JSON.stringify(peopleSearch, null, 2));
        }
    }
})();