const google = require('googlethis');

async function test() {
  const options = {
    page: 0, 
    safe: false, 
    additional_params: { 
      hl: 'en' 
    }
  };

  const response = await google.image('Logitech G102 Lightsync mouse', options);
  console.log(response[0].url);
}
test();
