import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if "import { Send, Heart," in l:
        lines[i] = l.replace("import { Send, Heart,", "import { Send, Heart, Flame,")
        break

lines.insert(3, "import { motion } from 'framer-motion';\n")

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
