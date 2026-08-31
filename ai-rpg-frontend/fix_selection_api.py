import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

target = """              ) : savedCharacters.length === 0 ? (
                <div className="text-center">
                  <p className="text-[#3d2b1f] mb-4 font-bold">Přihlášen jako: {email}</p>"""

replacement = """              ) : savedCharacters.length === 0 ? (
                <div className="text-center">
                  <div className="mb-4 text-left">
                    <label className="block font-bold mb-2 text-[#3d2b1f]">Gemini API Klíč</label>
                    <input type="password" value={apiKey} onChange={e => {setApiKey(e.target.value); localStorage.setItem("aethelgard_api_key", e.target.value.trim());}} className="w-full p-2 bg-[#e8dcc4] border border-[#c4a47c] rounded outline-none focus:ring-2 focus:ring-[#8b1e1e]" placeholder="AIzaSy..." />
                  </div>
                  <p className="text-[#3d2b1f] mb-4 font-bold">Přihlášen jako: {email}</p>"""

content = content.replace(target, replacement)

target2 = """              ) : (
                <div className="space-y-4">
                  <p className="text-[#3d2b1f] font-bold text-center">Přihlášen jako: {email}</p>"""

replacement2 = """              ) : (
                <div className="space-y-4">
                  <div className="mb-4 text-left">
                    <label className="block font-bold mb-2 text-[#3d2b1f]">Gemini API Klíč</label>
                    <input type="password" value={apiKey} onChange={e => {setApiKey(e.target.value); localStorage.setItem("aethelgard_api_key", e.target.value.trim());}} className="w-full p-2 bg-[#e8dcc4] border border-[#c4a47c] rounded outline-none focus:ring-2 focus:ring-[#8b1e1e]" placeholder="AIzaSy..." />
                  </div>
                  <p className="text-[#3d2b1f] font-bold text-center">Přihlášen jako: {email}</p>"""

content = content.replace(target2, replacement2)


with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Selection API Key fixed!")
