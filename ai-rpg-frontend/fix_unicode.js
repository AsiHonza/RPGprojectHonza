const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const regexMap = [
  { match: /Kritick ƭsp>ch/g, replace: 'Kritický úspěch' },
  { match: /Kritick selhn/g, replace: 'Kritické selhání' },
  { match: /Kritick neƭsp>ch/g, replace: 'Kritický neúspěch' },
  { match: /sp>ch/g, replace: 'Úspěch' },
  { match: /Selhn/g, replace: 'Selhání' },
  { match: /Hr ztrc/g, replace: 'Hráč ztrácí' },
  { match: /ztrc/g, replace: 'ztrácí' },
  { match: /zpsobuje/g, replace: 'způsobuje' },
  { match: /bod.*pokozen/g, replace: 'bodů poškození' },
  { match: /Ztrc/g, replace: 'Ztrácí' },
  { match: /tok vlka/g, replace: 'Útok vlka' },
  { match: /tok nepttele/g, replace: 'Útok nepřítele' },
  { match: /tok skteta/g, replace: 'Útok skřeta' },
  { match: /tok orka/g, replace: 'Útok orka' },
  { match: /tok hre/g, replace: 'Útok hráče' },
  { match: /Zsah/g, replace: 'Zásah' },
  { match: /Aktivn akce/g, replace: 'Aktivní akce' },
  { match: /Vsledek/g, replace: 'Výsledek' }
];

// Re-write the FormattedSystemLog completely without touching the rest of the file
const startToken = "const FormattedSystemLog = ({ text }: { text: string }) => {";
const endToken = "  };";

const startIndex = content.indexOf(startToken);
if (startIndex !== -1) {
    const endIndex = content.indexOf(endToken, startIndex) + endToken.length;
    const newFunc = `const FormattedSystemLog = ({ text }: { text: string }) => {
    const lines = text.split('\\n').map((line, idx) => {
      let html = line
        .replace(/(Kritický úspěch!|Kritický úspěch|Kritický úspěch\\.)/gi, '<span class="text-green-400 font-bold uppercase tracking-wider">$1</span>')
        .replace(/(Kritické selhání!|Kritické selhání|Kritický neúspěch)/gi, '<span class="text-red-500 font-bold uppercase tracking-wider">$1</span>')
        .replace(/(Úspěch\\.|Úspěch!|Úspěch:?)/gi, '<span class="text-green-400 font-bold">$1</span>')
        .replace(/(Selhání\\.|Selhání!|Selhání:?)/gi, '<span class="text-red-400 font-bold">$1</span>')
        .replace(/(Hráč ztrácí \\d+ HP|ztrácí \\d+ HP|způsobuje \\d+ bodů poškození|Ztrácí \\d+ HP)/gi, '<span class="text-red-400 font-bold">$1</span>')
        .replace(/(d\\d+\\(\\d+\\))/g, '<span class="text-yellow-400 font-bold">$1</span>')
        .replace(/(\\d+ vs DC \\d+)/g, '<span class="text-yellow-400 font-bold">$1</span>')
        .replace(/(vs AC \\d+)/g, '<span class="text-yellow-400 font-bold">$1</span>')
        .replace(/(Útok vlka|Útok nepřítele|Útok skřeta|Útok orka)/gi, '<span class="text-red-400 font-bold">$1</span>')
        .replace(/(Útok hráče.*?:)/gi, '<span class="text-green-400 font-bold">$1</span>')
        .replace(/(Zásah!)/g, '<span class="font-bold border-b border-red-400 text-red-400">$1</span>')
        .replace(/(Hod na .*?:)/gi, '<span class="text-rpg-magic font-bold">$1</span>')
        .replace(/(Aktivní akce:)/gi, '<span class="text-blue-300 font-bold">$1</span>')
        .replace(/(Výsledek:)/gi, '<span class="text-gray-200 font-bold">$1</span>');
      
      return (
        <div key={idx} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: html }} />
      );
    });
    return <div className="font-mono text-sm text-gray-300 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/10 shadow-inner mt-2">{lines}</div>;
  };`;
    
    content = content.substring(0, startIndex) + newFunc + content.substring(endIndex);
}

fs.writeFileSync('src/app/page.tsx', content, 'utf8');
