const puppeteer = require('puppeteer');

async function searchImage(query) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    try {
        await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, { waitUntil: 'networkidle2' });
        
        const html = await page.content();
        const urls = html.match(/external-content\.duckduckgo\.com[^"'\s]+/g);
        
        await browser.close();
        if (urls && urls.length > 0) return urls[0];
        return null;
    } catch (e) {
        console.error(e);
        await browser.close();
        return null;
    }
}

(async () => {
    console.log(await searchImage('Logitech G102 Lightsync mouse'));
})();
