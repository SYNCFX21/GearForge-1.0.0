const puppeteer = require('puppeteer');

async function searchImage(query) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    try {
        await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, { waitUntil: 'networkidle2' });
        // wait for images to load
        await page.waitForSelector('.tile--img__img', { timeout: 10000 });
        
        // Extract the first image src
        const imageUrl = await page.evaluate(() => {
            const img = document.querySelector('.tile--img__img');
            return img ? img.src : null;
        });
        
        await browser.close();
        
        if (imageUrl && imageUrl.startsWith('//')) {
             return 'https:' + imageUrl;
        }
        return imageUrl;
    } catch (e) {
        console.error(e);
        await browser.close();
        return null;
    }
}

(async () => {
    console.log(await searchImage('Logitech G102 Lightsync mouse'));
})();
