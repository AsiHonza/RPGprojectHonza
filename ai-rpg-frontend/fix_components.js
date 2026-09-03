const fs = require('fs');
const glob = require('glob'); // Not available? I'll just use a quick node script

const files = [
    'src/app/page.tsx',
    'src/features/map/MapModal.tsx',
    'src/components/FormattedSystemLog.tsx' // Actually inside page.tsx
];

function scanAndFix(dir) {
    const fs = require('fs');
    const path = require('path');

    function walk(directory) {
        const list = fs.readdirSync(directory);
        list.forEach(file => {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);
            if (stat && stat.isDirectory()) {
                walk(fullPath);
            } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
                fixTheme(fullPath);
            }
        });
    }

    function fixTheme(filePath) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        content = content.replace(/bg-black\/90/g, 'bg-white/95');
        content = content.replace(/bg-black\/80/g, 'bg-white/90');
        content = content.replace(/bg-black\/70/g, 'bg-white/80');
        content = content.replace(/bg-black\/60/g, 'bg-[#f9f6e6]/80');
        content = content.replace(/bg-black\/50/g, 'bg-[#f9f6e6]/70');
        content = content.replace(/bg-black\/40/g, 'bg-[#f9f6e6]/60');
        content = content.replace(/bg-black\/30/g, 'bg-[#f9f6e6]/50');
        content = content.replace(/bg-black\/20/g, 'bg-[#f9f6e6]/40');
        content = content.replace(/bg-black\/10/g, 'bg-[#f9f6e6]/30');
        
        content = content.replace(/bg-slate-900\/90/g, 'bg-white/90');
        content = content.replace(/bg-slate-900\/80/g, 'bg-[#f4ecd8]/90');
        content = content.replace(/bg-slate-900/g, 'bg-[#f4ecd8]');
        content = content.replace(/bg-slate-950/g, 'bg-[#e5dfc5]');

        content = content.replace(/text-white\/80/g, 'text-slate-900/80');
        content = content.replace(/text-white\/70/g, 'text-slate-900/70');
        content = content.replace(/text-white\/60/g, 'text-slate-900/60');
        content = content.replace(/text-white\/50/g, 'text-slate-900/50');
        content = content.replace(/text-white\/40/g, 'text-slate-900/40');
        content = content.replace(/text-white\/30/g, 'text-slate-900/30');
        content = content.replace(/text-white\/20/g, 'text-slate-900/20');
        content = content.replace(/text-white\/10/g, 'text-slate-900/10');
        
        content = content.replace(/text-white/g, 'text-slate-900');
        content = content.replace(/text-gray-200/g, 'text-slate-900');
        content = content.replace(/text-gray-300/g, 'text-slate-800');
        content = content.replace(/text-gray-400/g, 'text-slate-700');
        content = content.replace(/text-gray-500/g, 'text-slate-600');
        
        content = content.replace(/border-white\/10/g, 'border-amber-900/10');
        content = content.replace(/border-white\/20/g, 'border-amber-900/20');
        content = content.replace(/border-white\/30/g, 'border-amber-900/30');
        content = content.replace(/border-white\/5/g, 'border-amber-900/5');

        // Buttons and inputs
        content = content.replace(/bg-white\/5/g, 'bg-white/50');
        content = content.replace(/bg-white\/10/g, 'bg-white/70');
        content = content.replace(/bg-white\/20/g, 'bg-white/80');
        
        content = content.replace(/bg-\[\#111827\]/g, 'bg-[#f4ecd8]'); // layout body background

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log("Updated", filePath);
        }
    }

    walk(dir);
}

scanAndFix('src');
