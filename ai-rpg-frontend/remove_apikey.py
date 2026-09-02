import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Remove state and useEffect
content = content.replace('const [apiKey, setApiKey] = useState("");\n', '')
content = content.replace('const savedKey = localStorage.getItem("aethelgard_api_key");\n    if (savedKey) setApiKey(savedKey);\n', '')
content = content.replace('localStorage.setItem("aethelgard_api_key", apiKey.trim());\n', '')
content = content.replace('apiKey, ', '') # in dependency arrays

# 2. Update validations
content = content.replace('if (!name || !apiKey || !keywords) return alert("Zadejte jméno, API klíč a klíčová slova!");', 'if (!name || !keywords) return alert("Zadejte jméno a klíčová slova!");')
content = content.replace('if (!name || !apiKey) return alert("Zadejte jméno a API klíč!");', 'if (!name) return alert("Zadejte jméno!");')

# 3. Hardcode DUMMY in requests
content = content.replace('api_key: apiKey.trim() || "DUMMY"', 'api_key: "DUMMY"')
content = content.replace('api_key: apiKey.trim()', 'api_key: "DUMMY"')

# 4. Remove UI element
ui_block = """            <div>
              <label className="block font-bold mb-2">Gemini API Klíč</label>
              <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full p-2 bg-[#e3dcc8] border border-[#90a4ae] rounded outline-none focus:ring-2 focus:ring-[#b74b4b]" placeholder="AQ.Ab..." />
            </div>"""

content = content.replace(ui_block, '')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("API Key UI removed!")
