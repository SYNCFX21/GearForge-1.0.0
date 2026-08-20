const { image_search } = require('duckduckgo-images-api');

async function test() {
  const results = await image_search({ query: "Logitech G102 Lightsync mouse", moderate: true });
  console.log(results[0].image);
}
test();
