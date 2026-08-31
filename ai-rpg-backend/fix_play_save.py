import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = content.replace("}).eq(\"api_key\", req.api_key).execute()", "}).eq(\"api_key\", db_key).execute()")

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("play_action save fixed.")
