import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Imports
if "Menu" not in content:
    content = content.replace('from "lucide-react";', ', Menu } from "lucide-react";')

# 2. State variables
if "const [mobileMenuOpen" not in content:
    state_injection = """  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadQuests, setUnreadQuests] = useState(false);
  const [questBanner, setQuestBanner] = useState<{title: string, subtitle: string} | null>(null);
  
  const prevQuestsRef = useRef(quests);
  useEffect(() => {
    const prev = prevQuestsRef.current;
    if (prev.length > 0 || quests.length > 0) {
      if (JSON.stringify(prev) !== JSON.stringify(quests)) {
        setUnreadQuests(true);
        const newQuest = quests.find(q => !prev.some(pq => pq.id === q.id));
        if (newQuest) {
           setQuestBanner({title: "ÚKOL PŘIJAT", subtitle: newQuest.nazev});
        } else {
           const completedQuest = quests.find(q => (q.stav === 'splněno' || q.stav === 'splneno') && prev.some(pq => pq.id === q.id && pq.stav !== 'splněno' && pq.stav !== 'splneno'));
           if (completedQuest) {
              setQuestBanner({title: "ÚKOL SPLNĚN", subtitle: completedQuest.nazev});
           } else {
              setQuestBanner({title: "DENÍK ÚKOLŮ AKTUALIZOVÁN", subtitle: ""});
           }
        }
        setTimeout(() => setQuestBanner(null), 3500);
      }
    }
    prevQuestsRef.current = quests;
  }, [quests]);"""
    
    content = content.replace('const [currentImageError, setCurrentImageError] = useState<string | null>(null);', 
                              'const [currentImageError, setCurrentImageError] = useState<string | null>(null);\n' + state_injection)

# 3. Banner Render (at the very bottom of the main layout, before the closing </div> of the main div)
banner_ui = """      {/* Epic Quest Banner */}
      {questBanner && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
           <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center bg-black/70 px-12 py-6 border-y-4 border-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.4)] backdrop-blur-sm">
             <div className="text-[#d4af37] text-xs sm:text-sm font-bold tracking-[0.4em] uppercase mb-2">{questBanner.title}</div>
             <div className="text-[#f4f1e1] text-xl sm:text-3xl font-serif drop-shadow-lg text-center max-w-md">{questBanner.subtitle}</div>
           </div>
        </div>
      )}
    </div>
  );"""

content = re.sub(r'    </div>\s*<audio.*?/>\s*</div>\s*\);\s*\}', banner_ui.replace('    </div>\n  );', '    </div>\n      <audio ref={audioRef} onEnded={handleAudioEnd} autoPlay={true} />\n    </div>\n  );'), content, flags=re.DOTALL)
# The regex above is safer by looking at the very end. Actually, let's just append it right before the last <audio> tag.
content = content.replace('<audio ref={audioRef} onEnded={handleAudioEnd} autoPlay={true} />', 
                          banner_ui.replace('    </div>\n  );', '') + '\n      <audio ref={audioRef} onEnded={handleAudioEnd} autoPlay={true} />')


# 4. Top Bar Mobile Menu and Quest button
# Old top bar buttons:
# <button onClick={() => setStatsOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Statistiky">
#   <User size={18} />
# </button>
# ...
# We want to replace the flex container of the buttons to support the mobile menu.
new_top_bar_buttons = """<div className="flex gap-2 sm:gap-3 relative">
              {/* Desktop-only secondary buttons */}
              <button onClick={() => setStatsOpen(true)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Statistiky">
                <User size={18} />
              </button>
              <button onClick={() => setJournalOpen(true)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Deník příběhu">
                <ScrollText size={18} />
              </button>
              
              {/* Always visible main buttons */}
              <button onClick={() => { setQuestsOpen(true); setUnreadQuests(false); }} className={`relative flex items-center gap-1 font-bold transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border ${unreadQuests ? 'text-[#d4af37] border-[#d4af37] shadow-[0_0_10px_#d4af37]' : 'text-[#2b4c5e] hover:text-[#b74b4b] border-[#90a4ae]'}`} title="Úkoly">
                <BookOpen size={18} />
                {unreadQuests && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white animate-pulse"></span>}
              </button>
              <button onClick={() => setInventoryOpen(true)} className="flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Batoh">
                <Package size={18} />
              </button>
              
              {/* Desktop-only settings/music */}
              <button onClick={() => setMusicPlaying(!musicPlaying)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Hudba">
                {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button onClick={() => setSettingsOpen(true)} className="hidden sm:flex items-center gap-1 font-bold text-[#2b4c5e] hover:text-[#b74b4b] transition cursor-pointer bg-[#e3dcc8] px-2 py-1 rounded border border-[#90a4ae]" title="Nastavení">
                <Settings2 size={18} />
              </button>

              {/* Mobile Hamburger Menu Button */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden flex items-center gap-1 font-bold text-[#f4f1e1] hover:text-[#d4af37] transition cursor-pointer bg-[#2b4c5e] px-2 py-1 rounded border border-[#455a64]">
                <Menu size={18} />
              </button>

              {/* Mobile Dropdown Menu */}
              {mobileMenuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-[#1e3746] border-2 border-[#455a64] rounded-lg shadow-2xl p-2 flex flex-col gap-2 z-50 sm:hidden">
                  <button onClick={() => { setStatsOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-[#f4f1e1] hover:bg-[#2b4c5e] p-2 rounded transition text-left">
                    <User size={18} /> Statistiky
                  </button>
                  <button onClick={() => { setJournalOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-[#f4f1e1] hover:bg-[#2b4c5e] p-2 rounded transition text-left">
                    <ScrollText size={18} /> Deník příběhu
                  </button>
                  <button onClick={() => { setMusicPlaying(!musicPlaying); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-[#f4f1e1] hover:bg-[#2b4c5e] p-2 rounded transition text-left">
                    {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />} Hudba
                  </button>
                  <button onClick={() => { setSettingsOpen(true); setMobileMenuOpen(false); }} className="flex items-center gap-3 text-[#f4f1e1] hover:bg-[#2b4c5e] p-2 rounded transition text-left">
                    <Settings2 size={18} /> Nastavení
                  </button>
                </div>
              )}
            </div>"""

content = re.sub(
    r'<div className="flex gap-1 sm:gap-3">.*?<button onClick=\{\(\) => setSettingsOpen\(true\)\}.*?</button>\s*</div>',
    new_top_bar_buttons,
    content,
    flags=re.DOTALL
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("UI upgraded successfully.")
