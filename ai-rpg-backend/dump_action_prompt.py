import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    lines = f.readlines()

in_prompt = False
for line in lines:
    if "system_instruction=f" in line or 'system_instruction="""' in line:
        in_prompt = True
    if in_prompt:
        print(line.strip())
        if "response_mime_type" in line or "response_schema" in line:
            break
