const https = require('https');
const cheerio = require('cheerio'); // Need to install cheerio if not present
// let's just use regex since cheerio might not be installed

async function searchYahooImage(query) {
  return new Promise((resolve) => {
    https.get('https://images.search.yahoo.com/search/images?p=' + encodeURIComponent(query), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    }, (res) => {
        let html = '';
        res.on('data', c => html += c);
        res.on('end', () => {
            const match = html.match(/imgurl=&quot;(https?[^&]+)&quot;/);
            if (match) {
                resolve(match[1]);
            } else {
                resolve(null);
            }
        });
    }).on('error', () => resolve(null));
  });
}

(async () => {
    console.log(await searchYahooImage('Logitech G102 Lightsync mouse'));
})();
