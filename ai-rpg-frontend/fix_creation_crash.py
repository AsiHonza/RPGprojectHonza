import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# I will use regex to remove the apiKey div in the creation block
pattern = r'<div>\s*<label className="block font-bold mb-2">Gemini API Klíč</label>\s*<input type="password" value=\{apiKey\} onChange=\{e => setApiKey\(e\.target\.value\)\} className="w-full p-2 bg-\[#e3dcc8\] border border-\[#90a4ae\] rounded outline-none focus:ring-2 focus:ring-\[#b74b4b\]" placeholder="AQ\.Ab\.\.\." />\s*</div>'

content = re.sub(pattern, '', content)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Creation crash fixed!")
