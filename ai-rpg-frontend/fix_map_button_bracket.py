import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '<Map size={20} /></button>}' in l:
        lines[i] = l.replace('<Map size={20} /></button>}', '<Map size={20} /></button>')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
