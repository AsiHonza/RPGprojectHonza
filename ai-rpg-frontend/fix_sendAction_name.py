import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

content = content.replace(
    '          email: email,\n          api_key: apiKey.trim() || "DUMMY", \n          action_text: actionText,',
    '          email: email,\n          api_key: apiKey.trim() || "DUMMY", \n          name: name,\n          action_text: actionText,'
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("sendAction name payload fixed.")
