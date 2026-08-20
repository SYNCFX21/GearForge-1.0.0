const gis = require('g-i-s');

gis('Logitech G102 Lightsync mouse', logResults);

function logResults(error, results) {
  if (error) {
    console.log(error);
  }
  else {
    console.log(results[0].url);
  }
}
