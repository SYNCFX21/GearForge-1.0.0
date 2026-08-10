const https = require('https');

async function searchImage(query) {
  return new Promise((resolve) => {
    https.get('https://duckduckgo.com/?q=' + encodeURIComponent(query) + '&iax=images&ia=images', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
        let html = '';
        res.on('data', c => html += c);
        res.on('end', () => {
            const vqdMatch = html.match(/vqd="([^"]+)"/);
            if (!vqdMatch) return resolve("NO VQD: " + html.substring(0, 100));
            const vqd = vqdMatch[1];
            
            const reqUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}&f=,,,&p=1`;
            const req = https.get(reqUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
              }
            }, (res2) => {
                let data = '';
                res2.on('data', c => data += c);
                res2.on('end', () => {
                    resolve(data.substring(0, 500));
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
