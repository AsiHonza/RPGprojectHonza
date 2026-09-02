import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace(
    'from "lucide-react";',
    ', Brain } from "lucide-react";'
).replace('} , Brain', ', Brain }')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Brain import fixed.")
