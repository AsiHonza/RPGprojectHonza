import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    # Fix the Suggested Actions wrapper
    if '<div className="flex flex-wrap gap-2 flex-1">' in l:
        lines[i] = l.replace('<div className="flex flex-wrap gap-2 flex-1">', '<div className="flex flex-nowrap gap-2 flex-1 overflow-x-auto snap-x custom-scrollbar hide-scrollbar pb-2">')

    # Fix the system_log inside DM messages
    if '{msg.system_log}' in l and 'className="text-xs text-gray-500 font-mono mt-2 opacity-70"' in lines[i-1]:
        lines[i-1] = lines[i-1].replace('className="text-xs text-gray-500 font-mono mt-2 opacity-70"', 'className="text-xs font-mono mt-2 opacity-90 border-t border-white/10 pt-2"')
        lines[i] = '                          <FormattedSystemLog text={msg.system_log} />\n'

    # Fix FormattedSystemLog colors for dark mode
    if 'text-red-600' in l and 'FormattedSystemLog' in "".join(lines[i-10:i+1]):
        lines[i] = l.replace('text-red-600', 'text-red-400')
    if 'text-green-600' in l and 'FormattedSystemLog' in "".join(lines[i-10:i+1]):
        lines[i] = l.replace('text-green-600', 'text-green-400')
    if 'text-yellow-600' in l and 'FormattedSystemLog' in "".join(lines[i-10:i+1]):
        lines[i] = l.replace('text-yellow-600', 'text-yellow-400')
    if 'text-red-500' in l and 'FormattedSystemLog' in "".join(lines[i-10:i+1]):
        lines[i] = l.replace('text-red-500', 'text-red-400')
    if 'text-green-500' in l and 'FormattedSystemLog' in "".join(lines[i-10:i+1]):
        lines[i] = l.replace('text-green-500', 'text-green-400')
    if 'text-[#2b4c5e]' in l and 'FormattedSystemLog' in "".join(lines[i-15:i+5]):
        lines[i] = l.replace('text-[#2b4c5e]', 'text-gray-300')
    if 'font-serif' in l and 'FormattedSystemLog' in "".join(lines[i-15:i+5]):
        lines[i] = l.replace('font-serif', 'font-mono')
        
    # Let's also add more comprehensive matching to FormattedSystemLog
    if '.replace(/(Selh' in l and 'FormattedSystemLog' in "".join(lines[i-15:i+5]):
        lines[i] = l.replace('Selh', 'Selh') # Do nothing but find it
        # Actually, let's insert a better replacement block. We'll just replace the whole FormattedSystemLog block.

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
