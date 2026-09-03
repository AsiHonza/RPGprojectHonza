const fs = require('fs');
const path = require('path');

function replaceColors(filePath) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/bg-black\/90/g, 'bg-white/95');
    content = content.replace(/bg-black\/80/g, 'bg-white/90');
    content = content.replace(/bg-black\/70/g, 'bg-white/80');
    content = content.replace(/bg-black\/60/g, 'bg-[#f9f6e6]/80');
    content = content.replace(/bg-black\/50/g, 'bg-[#f9f6e6]/70');
    content = content.replace(/bg-black\/40/g, 'bg-[#f9f6e6]/60');
    
    content = content.replace(/bg-rpg-obsidian/g, 'bg-[#f9f6e6]');
    
    content = content.replace(/text-white/g, 'text-slate-900');
    content = content.replace(/text-gray-300/g, 'text-slate-800');
    content = content.replace(/text-gray-400/g, 'text-slate-700');
    content = content.replace(/text-gray-500/g, 'text-slate-600');
    
    // In MapModal, there might be bg-gray-900 or border-gray-800
    content = content.replace(/bg-gray-900/g, 'bg-[#f4ecd8]');
    content = content.replace(/border-gray-800/g, 'border-amber-900/20');
    content = content.replace(/bg-gray-800/g, 'bg-[#e5dfc5]');

    fs.writeFileSync(filePath, content, 'utf8');
}

replaceColors('src/features/map/MapModal.tsx');
replaceColors('src/app/page.tsx'); // some remnants
replaceColors('src/components/FormattedSystemLog.tsx');

