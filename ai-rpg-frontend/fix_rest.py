import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

old_actions = """                {suggestedActions.map((act, i) => (
                  <button 
                    key={`act-${i}`} 
                    onClick={() => sendAction(act)}
                    className="bg-[#1a120b] border border-[#c4a47c] text-[#e8dcc4] px-4 py-2 rounded-sm text-sm hover:bg-[#c4a47c] hover:text-[#1a120b] transition-all shadow-md font-serif"
                  >
                    {act}
                  </button>
                ))}
              </>"""

new_actions = """                {suggestedActions.map((act, i) => (
                  <button 
                    key={`act-${i}`} 
                    onClick={() => sendAction(act)}
                    className="bg-[#1a120b] border border-[#c4a47c] text-[#e8dcc4] px-4 py-2 rounded-sm text-sm hover:bg-[#c4a47c] hover:text-[#1a120b] transition-all shadow-md font-serif"
                  >
                    {act}
                  </button>
                ))}
                <button 
                  onClick={() => sendAction("Rozhodl jsem se utábořit a dát si Dlouhý odpočinek (Long rest) pro obnovu HP a kouzel.")}
                  className="bg-[#3d2b1f] border border-[#d4af37] text-[#d4af37] px-4 py-2 rounded-sm text-sm hover:bg-[#d4af37] hover:text-[#1a120b] transition-all shadow-md font-serif font-bold flex items-center gap-1"
                  title="Obnoví HP a Spell sloty. Pozor, může spustit noční události!"
                >
                  🏕️ Utábořit se
                </button>
              </>"""

content = content.replace(old_actions, new_actions)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Resting button added!")
