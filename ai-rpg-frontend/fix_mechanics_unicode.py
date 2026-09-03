import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if '.replace(/\\b(Úspěch\\.|Úspěch!|Úspěch:?)\\b/gi' in l:
        lines[i] = '        .replace(/(?<!\\p{L})(Úspěch\\.|Úspěch!|Úspěch:?)/giu, \'<span class="text-green-700 font-bold">$1</span>\')\n'
    elif '.replace(/\\b(Selhání\\.|Selhání!|Selhání:?|Neúspěch\\.|Neúspěch!|Neúspěch:?)\\b/gi' in l:
        lines[i] = '        .replace(/(?<!\\p{L})(Selhání\\.|Selhání!|Selhání:?|Neúspěch\\.|Neúspěch!|Neúspěch:?)/giu, \'<span class="text-red-700 font-bold">$1</span>\')\n'

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
