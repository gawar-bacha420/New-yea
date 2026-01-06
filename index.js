const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const express = require('express');

puppeteer.use(StealthPlugin());
const app = express();
app.use(express.json());

const TARGET_UID = "61584657088076"; // Aapka fix target

async function startAutomation(cookieJSON, haterName, messages, lastName, delay) {
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: '/usr/bin/google-chrome', 
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    try {
        const cookies = JSON.parse(cookieJSON);
        await page.setCookie(...cookies);
        await page.goto(`https://www.facebook.com/messages/t/${TARGET_UID}`, { waitUntil: 'networkidle2' });

        const msgList = messages.split('\n').filter(m => m.trim());
        let index = 0;

        while (true) {
            if (index >= msgList.length) index = 0;
            const fullMsg = `${haterName} ${msgList[index]} ${lastName}`;
            
            await page.waitForSelector('div[aria-label="Message"]');
            await page.click('div[aria-label="Message"]');
            await page.keyboard.type(fullMsg);
            await page.keyboard.press('Enter');

            console.log(`✅ Granted Message Sent: ${fullMsg}`);
            index++;
            await new Promise(r => setTimeout(r, delay * 1000));
        }
    } catch (err) {
        console.error("❌ Error:", err.message);
        await browser.close();
    }
}

app.get('/', (req, res) => res.send('<h1>RAJ E2EE SERVER ACTIVE</h1>'));
app.post('/run', (req) => startAutomation(req.body.cookies, req.body.haterName, req.body.messages, req.body.lastName, req.body.delay));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
