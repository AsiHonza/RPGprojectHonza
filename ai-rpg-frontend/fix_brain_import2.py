import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace(
    '} } from "lucide-react";',
    '} from "lucide-react";'
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Brain import fixed again.")
