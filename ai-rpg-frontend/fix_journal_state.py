import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace(
    'const [journalOpen, setJournalOpen] = useState(false);',
    'const [journalOpen, setJournalOpen] = useState(false);\n  const [journal, setJournal] = useState<string[]>([]);'
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Fixed missing setJournal")
