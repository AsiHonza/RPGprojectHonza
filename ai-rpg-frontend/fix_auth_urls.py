import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace('"http://localhost:8000/auth/register"', '`${API_URL}/auth/register`')
content = content.replace('"http://localhost:8000/auth/login"', '`${API_URL}/auth/login`')
content = content.replace('"http://127.0.0.1:8000/auth/register"', '`${API_URL}/auth/register`')
content = content.replace('"http://127.0.0.1:8000/auth/login"', '`${API_URL}/auth/login`')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Auth URLs replaced!")
