const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

content = content.replace(
  /epic%20high%20fantasy%20portrait/g,
  'vibrant%20fable%20style%20magical%20fantasy%20portrait'
);

fs.writeFileSync('src/app/page.tsx', content, 'utf8');
