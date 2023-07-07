const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');
const app = express();
const port = 5000;
const fs = require('fs');

app.use(cors());

app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    const browser = await puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
    });

    const output = [];
    let scrapeUrl = url;

    while (scrapeUrl) {
        const page = await browser.newPage();
        await page.goto(scrapeUrl, { waitUntil: 'domcontentloaded', timeout: 150000 });
        const restaurantLinks = await page.$$eval('.Lwqic', (restaurants) => restaurants.map((restaurant) => restaurant.href));

        for (const link of restaurantLinks) {
            const restaurantPage = await browser.newPage();
            await restaurantPage.goto(link, { waitUntil: 'domcontentloaded', timeout: 60000 });
            let phone;
            let name;

            try {
                phone = await restaurantPage.$eval('.AYHFM > a', (element) => element.textContent);
            } catch (err) {
                console.log('No phone number found for ' + name);
                phone = 'N/A';
            }

            try {
                name = await restaurantPage.$eval('h1', (element) => element.textContent.trim());
            } catch (err) {
                console.log('No name found for ' + link);
                name = 'N/A';
            }

            output.push({ name, phone });
            await restaurantPage.close();
        }

        try {
            scrapeUrl = await page.$eval('.nav.next.ui_button.primary', (element) => element.href);
        } catch (err) {
            scrapeUrl = null;
        }
        await page.close();
    }

    fs.writeFile('output.json', JSON.stringify(output, null, 2), (err) => {
        if (err) throw err;
        console.log('Data written to file');
    });

    await browser.close();
    res.json(output);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
