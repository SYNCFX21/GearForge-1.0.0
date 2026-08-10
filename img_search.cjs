const https = require('https');

async function searchImage(query) {
  return new Promise((resolve) => {
    const url = 'https://duckduckgo.com/i.js?q=' + encodeURIComponent(query) + '&o=json';
    https.get('https://duckduckgo.com/?q=' + encodeURIComponent(query) + '&iax=images&ia=images', (res) => {
        let html = '';
        res.on('data', c => html += c);
        res.on('end', () => {
            const vqdMatch = html.match(/vqd="([^"]+)"/);
            if (!vqdMatch) return resolve(null);
            const vqd = vqdMatch[1];
            
            const req = https.get(`https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,&p=1`, (res2) => {
                let data = '';
                res2.on('data', c => data += c);
                res2.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.results && json.results.length > 0) {
                            resolve(json.results[0].image);
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

(async () => {
    console.log(await searchImage('Logitech G102 Lightsync mouse'));
})();
