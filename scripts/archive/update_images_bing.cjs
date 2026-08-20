const fs = require('fs');
const puppeteer = require('puppeteer');

const delay = ms => new Promise(r => setTimeout(r, ms));

async function main() {
    let content = fs.readFileSync('src/data/accessories.ts', 'utf8');
    const itemRegex = /name:\s*'([^']+)',\s*\n\s*brand:[^,]+,\s*\n\s*category:\s*'([^']+)',\s*\n\s*imageUrl:\s*'([^']+)'/g;
    
    const replacements = [];
    let itemMatch;
    while ((itemMatch = itemRegex.exec(content)) !== null) {
        replacements.push({
            fullMatch: itemMatch[0],
            name: itemMatch[1],
            category: itemMatch[2],
            oldUrl: itemMatch[3]
        });
    }

    console.log(`Found ${replacements.length} items to update.`);
    
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    let updatedCount = 0;
    
    for (const item of replacements) {
        console.log(`Fetching image for: ${item.name}`);
        const query = `${item.name} ${item.category}`;
        const page = await browser.newPage();
        
        let newUrl = null;
        try {
            await page.goto(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}&form=HDRSC2`, { waitUntil: 'domcontentloaded' });
            const html = await page.content();
            const urls = html.match(/murl&quot;:&quot;(https?[^&]+)&quot;/g);
            
            if (urls && urls.length > 0) {
                // Try to find a nice URL that doesn't look like a tiny thumbnail, or just grab the first one
                let foundUrl = urls[0].replace('murl&quot;:&quot;', '').replace('&quot;', '');
                
                // Let's filter out some bad URLs (like wiki/file if they are html pages, but these are murl so they are direct images)
                newUrl = foundUrl;
            }
        } catch (e) {
            console.error("Error scraping " + item.name);
        }
        
        await page.close();
        
        if (newUrl) {
            console.log(` -> Found: ${newUrl}`);
            const newText = item.fullMatch.replace(item.oldUrl, newUrl);
            content = content.replace(item.fullMatch, newText);
            updatedCount++;
        } else {
            console.log(` -> Failed to find image.`);
        }
        await delay(500); // polite delay
    }
    
    await browser.close();
    
    if (updatedCount > 0) {
        fs.writeFileSync('src/data/accessories.ts', content);
        console.log(`Done updating accessories.ts (${updatedCount} updated)`);
    } else {
        console.log("No images updated.");
    }
}

main();
