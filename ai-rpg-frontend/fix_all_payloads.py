import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "api_key: apiKey.trim()," in line and "action_text: actionText," in lines[i+1]:
        lines[i] = '          email: email,\n          api_key: apiKey.trim() || "DUMMY", \n'
    
    if "api_key: apiKey.trim()," in line and "state: {" in lines[i+1]:
        lines[i] = '          email: email,\n          name: name,\n'
        
with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.writelines(lines)
print("All payloads fixed!")
