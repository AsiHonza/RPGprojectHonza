const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Fix mobile character selection truncate bug by adding shrink-0
content = content.replace(
  /className="group relative w-64 h-96 bg-black\/60/g,
  'className="group relative w-64 h-96 shrink-0 bg-black/60'
);

// 2. Fix desktop spacing (nahnacane na sobe). The Menu Dock and top HUD need some breathing room.
// The top HUD currently is:
// <div className="flex flex-col gap-2 mb-2 w-full max-w-5xl mx-auto z-10">
// We can change gap-2 to gap-2 md:gap-4, and mb-2 to mb-2 md:mb-6
content = content.replace(
  'className="flex flex-col gap-2 mb-2 w-full max-w-5xl mx-auto z-10"',
  'className="flex flex-col gap-2 md:gap-4 mb-2 md:mb-4 w-full max-w-5xl mx-auto z-10"'
);

// The Top HUD row 1 is:
// <div className="flex items-center justify-between bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-lg">
// Let's add more padding on desktop: p-2 md:p-4
content = content.replace(
  'className="flex items-center justify-between bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-lg"',
  'className="flex items-center justify-between bg-black/40 backdrop-blur-md p-2 md:p-4 rounded-2xl border border-white/10 shadow-lg"'
);

// The Menu Dock is:
// <div className="flex gap-1 sm:gap-2 bg-black/40 backdrop-blur-md border border-white/10 p-1 sm:p-2 rounded-2xl shadow-xl overflow-x-auto custom-scrollbar hide-scrollbar snap-x flex-nowrap">
// Let's add justify-center on md screens so it's centered, or maybe just md:p-3
content = content.replace(
  'className="flex gap-1 sm:gap-2 bg-black/40 backdrop-blur-md border border-white/10 p-1 sm:p-2 rounded-2xl shadow-xl overflow-x-auto custom-scrollbar hide-scrollbar snap-x flex-nowrap"',
  'className="flex gap-1 sm:gap-4 bg-black/40 backdrop-blur-md border border-white/10 p-1 sm:p-2 md:p-3 rounded-2xl shadow-xl overflow-x-auto custom-scrollbar hide-scrollbar snap-x flex-nowrap md:justify-center"'
);

// Also the main container:
// <div className="w-full max-w-7xl flex flex-col h-full relative z-10 p-2 md:p-6 pb-0">
// Change to md:p-8 for more breathing room
content = content.replace(
  'className="w-full max-w-7xl flex flex-col h-full relative z-10 p-2 md:p-6 pb-0"',
  'className="w-full max-w-7xl flex flex-col h-full relative z-10 p-2 md:p-8 pb-0"'
);

fs.writeFileSync('src/app/page.tsx', content, 'utf8');
