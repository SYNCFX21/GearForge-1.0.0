const https = require('https');
const query = "Rakk Dasig mouse";

function fetchImages(q) {
  const url = 'https://html.duckduckgo.com/html/?q=' + encodeURIComponent(q);
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      // The HTML version of DDG doesn't directly have the image URLs easily without the JS version, 
      // maybe it has a thumbnail?
      const regex = /vqd=([0-9-]+)/;
      const match = data.match(regex);
      if (match) {
        console.log("VQD:", match[1]);
      } else {
        console.log("No VQD");
      }
    });
  });
}
fetchImages(query);
