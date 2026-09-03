import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start_idx = -1
end_idx = -1

for i, l in enumerate(lines):
    if 'const FormattedSystemLog = ({ text }: { text: string }) => {' in l:
        start_idx = i
    if start_idx != -1 and '};' in l and i > start_idx:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    new_func = """const FormattedSystemLog = ({ text }: { text: string }) => {
    const lines = text.split('\\n').map((line, idx) => {
      let html = line
        .replace(/(Kritick ƭsp>ch!|Kritick ƭsp>ch|Kritick ƭsp>ch\.)/gi, '<span class="text-green-400 font-bold uppercase tracking-wider">$1</span>')
        .replace(/(Kritick selhn!|Kritick selhn|Kritick neƭsp>ch)/gi, '<span class="text-red-500 font-bold uppercase tracking-wider">$1</span>')
        .replace(/(sp>ch\.|sp>ch!|sp>ch:?)/gi, '<span class="text-green-400 font-bold">$1</span>')
        .replace(/(Selhn\.|Selhn!|Selhn:?)/gi, '<span class="text-red-400 font-bold">$1</span>')
        .replace(/(Hr ztrc \d+ HP|ztrc \d+ HP|zpsobuje \d+ bod.*pokozen|Ztrc \d+ HP)/gi, '<span class="text-red-400 font-bold">$1</span>')
        .replace(/(d\d+\(\d+\))/g, '<span class="text-yellow-400 font-bold">$1</span>')
        .replace(/(\d+ vs DC \d+)/g, '<span class="text-yellow-400 font-bold">$1</span>')
        .replace(/(vs AC \d+)/g, '<span class="text-yellow-400 font-bold">$1</span>')
        .replace(/(tok vlka|tok nepttele|tok skteta|tok orka)/gi, '<span class="text-red-400 font-bold">$1</span>')
        .replace(/(tok hre.*?:)/gi, '<span class="text-green-400 font-bold">$1</span>')
        .replace(/(Zsah!)/g, '<span class="font-bold border-b border-red-400 text-red-400">$1</span>')
        .replace(/(Hod na .*?:)/gi, '<span class="text-rpg-magic font-bold">$1</span>')
        .replace(/(Aktivn akce:)/gi, '<span class="text-blue-300 font-bold">$1</span>')
        .replace(/(Vsledek:)/gi, '<span class="text-gray-200 font-bold">$1</span>');
      
      return (
        <div key={idx} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: html }} />
      );
    });
    return <div className="font-mono text-sm text-gray-300 leading-relaxed bg-black/30 p-3 rounded-xl border border-white/5">{lines}</div>;
  };
"""
    # Replace lines
    for i in range(start_idx, end_idx + 1):
        lines[i] = ""
    lines[start_idx] = new_func

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
