const fs = require('fs');
const https = require('https');

async function searchImage(query) {
  return new Promise((resolve) => {
    https.get('https://duckduckgo.com/?q=' + encodeURIComponent(query) + '&iax=images&ia=images', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
        let html = '';
        res.on('data', c => html += c);
        res.on('end', () => {
            const vqdMatch = html.match(/vqd="([^"]+)"/);
            if (!vqdMatch) return resolve(null);
            const vqd = vqdMatch[1];
            
            const req = https.get(`https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,&p=1`, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
              }
            }, (res2) => {
                let data = '';
                res2.on('data', c => data += c);
                res2.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.results && json.results.length > 0) {
                            // Find an image that's likely to load (maybe skip some known strict domains, but let's just take the first)
                            let url = json.results[0].image;
                            resolve(url);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        resolve(null);
                    }
                });
            });
            req.on('error', () => resolve(null));
        });
    }).on('error', () => resolve(null));
  });
}

const delay = ms => new Promise(r => setTimeout(r, ms));

async function main() {
    let content = fs.readFileSync('src/data/accessories.ts', 'utf8');
    
    // Extract all names
    const nameRegex = /name:\s*'([^']+)'/g;
    let match;
    const items = [];
    while ((match = nameRegex.exec(content)) !== null) {
        items.push(match[1]);
    }
    
    // Filter out preset names, only keep accessories (which are below the presets)
    // Actually presets have name: '...' but they don't have imageUrl.
    // Let's just find imageUrl and the name before it.
    
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
    
    for (const item of replacements) {
        console.log(`Fetching image for: ${item.name}`);
        const query = `${item.name} ${item.category}`;
        const newUrl = await searchImage(query);
        if (newUrl) {
            console.log(` -> Found: ${newUrl}`);
            const newText = item.fullMatch.replace(item.oldUrl, newUrl);
            content = content.replace(item.fullMatch, newText);
        } else {
            console.log(` -> Failed to find image.`);
        }
        await delay(500); // polite delay
    }
    
    fs.writeFileSync('src/data/accessories.ts', content);
    console.log("Done updating accessories.ts");
}

main();
