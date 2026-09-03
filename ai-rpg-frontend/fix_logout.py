import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

new_logic = """
                <button 
                  onClick={() => {
                    localStorage.removeItem("aethelgard_session_email");
                    localStorage.removeItem("aethelgard_active_char");
                    window.location.reload();
                  }}
                  className="mt-4 px-8 py-2 text-slate-500 font-lora hover:text-slate-800 transition text-sm flex items-center gap-2"
                >
                  Odhlásit se
                </button>
"""

for i, l in enumerate(lines):
    if 'Vytvo' in l and 'Novou Legendu' in l and 'button' in lines[i+1]:
        lines.insert(i+2, new_logic)
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
