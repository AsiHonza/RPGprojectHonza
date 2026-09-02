import codecs

with codecs.open('src/app/page.tsx', 'r', 'utf-8') as f:
    content = f.read()

start = content.find("const getStringHash = (str: string) => {")
end = content.find("const [displayedText, setDisplayedText]")

if start != -1 and end != -1:
    new_content = content[:start] + content[end:]
    
    # Pridat import ItemIcon
    if "import { ItemIcon }" not in new_content:
        new_content = new_content.replace('import { Play', 'import { ItemIcon } from "../components/ui/ItemIcon";\nimport { Play')
        
    with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
        f.write(new_content)
    print("ItemIcon removed from page.tsx")
