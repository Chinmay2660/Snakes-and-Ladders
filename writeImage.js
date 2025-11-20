const fs = require('fs')
const data =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAuMBg2Yeli4AAAAASUVORK5CYII='
fs.mkdirSync('src/assets', { recursive: true })
fs.writeFileSync('src/assets/ladders.jpg', Buffer.from(data, 'base64'))
