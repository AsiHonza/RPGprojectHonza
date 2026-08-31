import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = content.replace(
    'dm_json["image_url"] = f"http://127.0.0.1:8000/images/{filename}"',
    'dm_json["image_url"] = f"/images/{filename}"'
)

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Backend URLs updated!")
