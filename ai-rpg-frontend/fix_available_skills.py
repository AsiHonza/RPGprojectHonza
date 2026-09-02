import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

old_skills_def = 'const [skills, setSkills] = useState<{id: string, name: string, desc: string}[]>([]);'
new_skills_def = 'const [skills, setSkills] = useState<{id: string, name: string, desc: string}[]>([]);\n  const [availableSkills, setAvailableSkills] = useState<any[]>([]);'

content = content.replace(old_skills_def, new_skills_def)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Added missing state declaration.")
