import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

content = content.replace("import os", "import os\nfrom dotenv import load_dotenv\nload_dotenv()")

with codecs.open("main.py", "w", "utf-8") as f:
    f.write(content)
print("Dotenv added!")
