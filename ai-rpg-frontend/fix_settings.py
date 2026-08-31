import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

settings_addition = """              <div>
                <label className="flex justify-between text-[#3d2b1f] font-bold mb-2">
                  <span>Gemini API Klíč</span>
                </label>
                <input 
                  type="password"
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="w-full bg-[#e8dcc4] text-[#3d2b1f] border border-[#c4a47c] rounded p-2"
                  placeholder="Zadejte Gemini klíč..."
                />
                <p className="text-xs text-[#8b1e1e] mt-1">Nutné pro hru.</p>
              </div>"""

content = content.replace(
    '            <div className="space-y-6">\n              <div>\n                <label className="flex justify-between text-[#3d2b1f] font-bold mb-2">',
    '            <div className="space-y-6">\n' + settings_addition + '\n              <div>\n                <label className="flex justify-between text-[#3d2b1f] font-bold mb-2">'
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Settings updated!")
