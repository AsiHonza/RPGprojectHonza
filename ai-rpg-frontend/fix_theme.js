const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// The main background gradient overlay
content = content.replace(
  'from-slate-950 via-slate-950/70 to-slate-900/40 backdrop-blur-sm',
  'from-[#f9f6e6]/95 via-[#f9f6e6]/70 to-[#f9f6e6]/30 backdrop-blur-sm'
);

// Black backgrounds to light paper backgrounds
content = content.replace(/bg-black\/80/g, 'bg-white/90');
content = content.replace(/bg-black\/70/g, 'bg-white/80');
content = content.replace(/bg-black\/60/g, 'bg-[#f9f6e6]/80');
content = content.replace(/bg-black\/50/g, 'bg-[#f9f6e6]/70');
content = content.replace(/bg-black\/40/g, 'bg-[#f9f6e6]/60');

// Slate backgrounds to light warm backgrounds
content = content.replace(/bg-slate-900\/90/g, 'bg-white/90');
content = content.replace(/bg-slate-900\/80/g, 'bg-[#f4ecd8]/90');
content = content.replace(/bg-slate-900/g, 'bg-[#f4ecd8]');
content = content.replace(/bg-slate-950/g, 'bg-[#e5dfc5]');

// Text colors
content = content.replace(/text-white/g, 'text-slate-900');
content = content.replace(/text-gray-300/g, 'text-slate-800');
content = content.replace(/text-gray-400/g, 'text-slate-700');
content = content.replace(/text-gray-500/g, 'text-slate-600');

// Borders
content = content.replace(/border-white\/10/g, 'border-amber-900/10');
content = content.replace(/border-white\/20/g, 'border-amber-900/20');
content = content.replace(/border-white\/5/g, 'border-amber-900/5');

// Subtle white backgrounds (like action buttons)
content = content.replace(/bg-white\/5/g, 'bg-white/50');
content = content.replace(/bg-white\/10/g, 'bg-white/70');

// Fix "text-slate-900/30" or similar that might have broken if they were text-white/30
content = content.replace(/text-slate-900\/30/g, 'text-slate-900/50');

// Make sure the main title and text stand out
content = content.replace(/text-slate-900/g, 'text-[#2d3748]');

fs.writeFileSync('src/app/page.tsx', content, 'utf8');
