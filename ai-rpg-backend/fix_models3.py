import codecs

with codecs.open("main.py", "r", "utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if line.startswith("class CharacterCreateRequest(BaseModel):"):
        for j in range(i, i+10):
            if "api_key: str" in lines[j]:
                lines[j] = "    email: str\n    api_key: str\n"
                break
    
    if line.startswith("class PlayerActionRequest(BaseModel):"):
        for j in range(i, i+10):
            if "api_key: str" in lines[j]:
                lines[j] = "    email: str\n    api_key: str\n"
                break

with codecs.open("main.py", "w", "utf-8") as f:
    f.writelines(lines)
print("Done.")
