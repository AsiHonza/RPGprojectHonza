import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Replace the flex gap-1 sm:gap-3 div content manually using regex but broader match
start_pattern = '<div className="flex gap-1 sm:gap-3">'
end_pattern = '</button>\n            </div>\n          </div>'

start_idx = content.find(start_pattern)
if start_idx != -1:
    end_idx = content.find(end_pattern, start_idx)
    if end_idx != -1:
        end_idx += len('</button>\n            </div>')
        
        old_block = content[start_idx:end_idx]
        
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

        content = content[:start_idx] + new_top_bar_buttons + content[end_idx:]
        with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
            f.write(content)
        print("Successfully replaced top bar.")
    else:
        print("End not found.")
else:
    print("Start not found.")
