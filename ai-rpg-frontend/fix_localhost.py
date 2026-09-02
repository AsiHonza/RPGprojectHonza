import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace('http://localhost:8000${endpoint}', '${API_URL}${endpoint}')
content = content.replace('"http://localhost:8000/list-characters"', '`${API_URL}/list-characters`')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Localhost fixed!")
