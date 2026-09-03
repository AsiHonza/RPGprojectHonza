const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

content = content.replace(/text-green-400/g, 'text-green-700');
content = content.replace(/text-red-400/g, 'text-red-700');
content = content.replace(/text-yellow-400/g, 'text-amber-700');
content = content.replace(/text-indigo-300/g, 'text-indigo-800');

// One more fix for the background in page.tsx
// if any bg-black remains
content = content.replace(/bg-black\/30/g, 'bg-[#f9f6e6]/50');
content = content.replace(/bg-black\/20/g, 'bg-[#f9f6e6]/40');
content = content.replace(/bg-black\/10/g, 'bg-[#f9f6e6]/30');
content = content.replace(/text-white\/30/g, 'text-slate-900/40');

fs.writeFileSync('src/app/page.tsx', content, 'utf8');
