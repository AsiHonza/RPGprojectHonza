import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Add state variable
state_injection = '  const [actionsOpen, setActionsOpen] = useState(false);\n  const [isRegistering, setIsRegistering] = useState(false);'
content = content.replace('  const [actionsOpen, setActionsOpen] = useState(false);', state_injection)

# 2. Modify Auth Buttons UI
import re
pattern = r'<div className="flex gap-2">\s*<button\s*onClick=\{\(\) => handleAuth\(false\)\}[\s\S]*?</button>\s*</div>'

replacement = """<div className="flex flex-col gap-4">
                  <button 
                    onClick={() => handleAuth(isRegistering)}
                    disabled={loading || !email || !password}
                    className="w-full py-3 bg-[#b74b4b] border-2 border-[#b74b4b] text-[#f4f1e1] font-bold rounded hover:bg-[#d46a6a] transition uppercase tracking-widest shadow-lg disabled:opacity-50"
                  >
                    {isRegistering ? "Vytvořit účet" : "Přihlásit do hry"}
                  </button>
                  <div className="text-center">
                    <button 
                      onClick={() => setIsRegistering(!isRegistering)}
                      className="text-[#455a64] hover:text-[#b74b4b] text-sm underline transition"
                    >
                      {isRegistering ? "Už máš účet? Přihlas se." : "Ještě nemáš účet? Zaregistruj se."}
                    </button>
                  </div>
                </div>"""

content = re.sub(pattern, replacement, content)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Auth UX fixed!")
