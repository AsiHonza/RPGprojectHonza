import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

old_header = """          <div className="flex gap-2">
            <button onClick={() => setStatsOpen(true)} className="flex items-center gap-1 font-bold text-[#3d2b1f] hover:text-[#8b1e1e] transition cursor-pointer bg-[#e8dcc4] px-2 py-1 rounded border border-[#c4a47c] relative" title="Vlastnosti postavy">
              <User size={18} />
              {skillPoints > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-bounce">{skillPoints}</span>}
            </button>
            <button onClick={() => setSkillsOpen(true)} className="flex items-center gap-1 font-bold text-[#3d2b1f] hover:text-[#8b1e1e] transition cursor-pointer bg-[#e8dcc4] px-2 py-1 rounded border border-[#c4a47c] relative" title="Bojové dovednosti">
              <Sparkles size={18} />
            </button>
            <button onClick={() => setQuestsOpen(true)} className="flex items-center gap-1 font-bold text-[#3d2b1f] hover:text-[#8b1e1e] transition cursor-pointer bg-[#e8dcc4] px-2 py-1 rounded border border-[#c4a47c] relative" title="Deník úkolů">
              <BookOpen size={18} />
              {quests.filter(q => q.stav === 'aktivni').length > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center">{quests.filter(q => q.stav === 'aktivni').length}</span>}
            </button>
            <button onClick={() => setInventoryOpen(true)} className="flex items-center gap-1 font-bold text-[#3d2b1f] hover:text-[#8b1e1e] transition cursor-pointer bg-[#e8dcc4] px-2 py-1 rounded border border-[#c4a47c]" title="Batoh">
              <Package size={18} />
            </button>"""

new_header = """          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2 mr-2">
              <div className="bg-[#e8dcc4] border border-[#d4af37] px-2 py-1 rounded font-bold text-[#3d2b1f] flex items-center gap-1" title="Zlaťáky (gp)">
                <span className="text-xl">🪙</span> {gold}
              </div>
              {maxSpellSlots > 0 && (
                <div className="bg-[#1a120b] border border-[#4a7f4a] px-2 py-1 rounded font-bold text-[#4a7f4a] flex items-center gap-1 shadow-inner" title="Pozice kouzel">
                  ✨ {currentSpellSlots}/{maxSpellSlots}
                </div>
              )}
            </div>
            
            <button onClick={() => setStatsOpen(true)} className="flex items-center gap-1 font-bold text-[#3d2b1f] hover:text-[#8b1e1e] transition cursor-pointer bg-[#e8dcc4] px-2 py-1 rounded border border-[#c4a47c] relative" title="Vlastnosti postavy">
              <User size={18} />
              {skillPoints > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-bounce">{skillPoints}</span>}
            </button>
            <button onClick={() => setSkillsOpen(true)} className="flex items-center gap-1 font-bold text-[#3d2b1f] hover:text-[#8b1e1e] transition cursor-pointer bg-[#e8dcc4] px-2 py-1 rounded border border-[#c4a47c] relative" title="Bojové dovednosti">
              <Sparkles size={18} />
            </button>
            <button onClick={() => setQuestsOpen(true)} className="flex items-center gap-1 font-bold text-[#3d2b1f] hover:text-[#8b1e1e] transition cursor-pointer bg-[#e8dcc4] px-2 py-1 rounded border border-[#c4a47c] relative" title="Deník úkolů">
              <BookOpen size={18} />
              {quests.filter(q => q.stav === 'aktivni').length > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center">{quests.filter(q => q.stav === 'aktivni').length}</span>}
            </button>
            <button onClick={() => setInventoryOpen(true)} className="flex items-center gap-1 font-bold text-[#3d2b1f] hover:text-[#8b1e1e] transition cursor-pointer bg-[#e8dcc4] px-2 py-1 rounded border border-[#c4a47c]" title="Batoh">
              <Package size={18} />
            </button>"""

content = content.replace(old_header, new_header)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Header patched!")
