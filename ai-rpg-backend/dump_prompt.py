import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    content = f.read()

start = content.find('system_instruction=')
if start != -1:
    end = content.find('response_mime_type', start)
    print(content[start:end])
