const urls = [
  'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1512446816042-444d641267d4?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=400&q=80'
];
async function check() {
  for (const url of urls) {
    const res = await fetch(url, { method: 'HEAD' });
    console.log(res.status, url);
  }
}
check();
