import codecs

lines = codecs.open('src/features/ui/SettingsModal.tsx', 'r', 'utf-8').readlines()

new_logic = """
              <div className="pt-4 mt-2 border-t border-[#90a4ae]">
                <button onClick={() => {
                  localStorage.removeItem("aethelgard_active_char");
                  window.location.reload();
                }} className="w-full py-2 border-2 border-amber-900/50 text-slate-800 rounded font-bold hover:bg-amber-900/10 transition flex justify-center items-center gap-2">
                  Zpět do menu (Odejít ze hry)
                </button>
              </div>
"""

for i, l in enumerate(lines):
    if '<div className="pt-4 mt-6 border-t border-[#90a4ae]">' in l:
        lines.insert(i, new_logic)
        break

with codecs.open('src/features/ui/SettingsModal.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
