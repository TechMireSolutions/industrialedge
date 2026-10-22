const https = require('https');
const fs = require('fs');

async function getUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}

async function main() {
  const html = await getUrl('https://oneuswp.themesflat.com/product/autofull-c3-gaming-chair-office-chair-ergonomic-computer-gaming-chair-pu-leather/');
  const matches = html.match(/https:\/\/oneuswp\.themesflat\.com\/wp-content\/uploads\/[^\"]+\.(?:webp|jpg|png)/g);
  console.log('Matches:', matches ? [...new Set(matches)] : 'none');
}

main();
