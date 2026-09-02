import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# I will use a regex to replace everything between `<div className="flex gap-2 text-[#2b4c5e]">` and the XP bar
content = re.sub(
    r'<div className="flex gap-2 text-\[#2b4c5e\]">.*?</div>\s*</div>\s*\{\/\* XP Bar \*\/\}',
    r"""<div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 text-[#2b4c5e]">
            {/* Status (HP & Food) */}
            <div className="flex items-center gap-4 text-sm sm:text-base mr-0 sm:mr-4">
              <div className="flex items-center gap-1 font-bold text-[#b74b4b]"><Drumstick size={18} /> <span key={`food-${rations}`} className="animate-flash">{rations}</span></div>
              <div className="flex items-center gap-1 font-bold text-[#b74b4b]"><Heart size={18} /> <span>{hp}/100</span></div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap sm:flex-nowrap justify-end gap-2 relative">
              <button onClick={() => setStatsOpen(true)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae] relative" title="Vlastnosti postavy">
                <User size={18} />
                {skillPoints > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-bounce">{skillPoints}</span>}
              </button>
              
              <button onClick={() => setSkillsOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae] relative" title="Bojové dovednosti">
                <Sparkles size={18} />
              </button>
              
              <button onClick={() => { setQuestsOpen(true); setUnreadQuests(false); }} className={`relative flex items-center gap-1 font-bold transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border ${unreadQuests ? 'text-[#d4af37] border-[#d4af37] shadow-[0_0_10px_#d4af37]' : 'text-[#2b4c5e] hover:text-[#b74b4b] border-[#90a4ae]'}`} title="Úkoly">
                <BookOpen size={18} />
                {unreadQuests && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-[#f4f1e1] animate-pulse"></span>}
                {!unreadQuests && quests.filter(q => q.stav === 'aktivni').length > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center">{quests.filter(q => q.stav === 'aktivni').length}</span>}
              </button>
              
              <button onClick={() => setInventoryOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Batoh">
                <Package size={18} />
              </button>

              <button onClick={() => setJournalOpen(true)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae] relative" title="Deník příběhu">
                <ScrollText size={18} />
              </button>
              <button onClick={() => setMusicPlaying(!musicPlaying)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Hudba">
                {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button onClick={() => setSettingsOpen(true)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Nastavení">
                <Settings2 size={18} />
              </button>

              {/* Mobile Hamburger */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden flex items-center gap-1 font-bold text-[#f4f1e1] hover:text-[#d4af37] transition cursor-pointer bg-[#2b4c5e] px-2 py-1 rounded border border-[#455a64]">
                <Menu size={18} />
              </button>

              {/* Mobile Dropdown */}
              {mobileMenuOpen && (
                <div className="absolute right-0 top-10 w-48 bg-[#f4f1e1] border-2 border-[#90a4ae] rounded shadow-xl p-2 flex flex-col gap-2 z-50 sm:hidden">
                  <button onClick={() => { setStatsOpen(true); setMobileMenuOpen(false); }} className="flex justify-between items-center text-[#2b4c5e] hover:bg-[#e3dcc8] p-2 rounded transition">
                    <span className="font-bold flex items-center gap-2"><User size={18} /> Vlastnosti</span>
                    {skillPoints > 0 && <span className="w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center animate-bounce">{skillPoints}</span>}
                  </button>
                  <button onClick={() => { setJournalOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-[#2b4c5e] hover:bg-[#e3dcc8] p-2 rounded transition font-bold text-left">
                    <ScrollText size={18} /> Deník
                  </button>
                  <button onClick={() => { setMusicPlaying(!musicPlaying); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-[#2b4c5e] hover:bg-[#e3dcc8] p-2 rounded transition font-bold text-left">
                    {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />} Hudba
                  </button>
                  <button onClick={() => { setSettingsOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-2 text-[#2b4c5e] hover:bg-[#e3dcc8] p-2 rounded transition font-bold text-left">
                    <Settings2 size={18} /> Nastavení
                  </button>
                </div>
              )}
            </div>
          </div>
        
        {/* XP Bar */}""",
    content,
    flags=re.DOTALL
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Regex replace done.")
