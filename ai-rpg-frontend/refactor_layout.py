import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

# We want to find the Top HUD and modify it to include the Menu Dock.
top_hud_idx = -1
for i, l in enumerate(lines):
    if '{/* Top HUD */}' in l:
        top_hud_idx = i
        break

menu_dock_start = -1
menu_dock_end = -1
for i, l in enumerate(lines):
    if '{/* Menu Dock */}' in l:
        menu_dock_start = i
    if menu_dock_start != -1 and '</div>' in l and i > menu_dock_start + 5:
        menu_dock_end = i
        break

if menu_dock_start != -1 and top_hud_idx != -1:
    menu_dock_lines = lines[menu_dock_start:menu_dock_end+1]
    
    # We will replace the Top HUD to be more compact and include the Menu Dock.
    
    # First, let's just delete the Menu Dock from the bottom
    for i in range(menu_dock_start, menu_dock_end+1):
        lines[i] = ""

    # Now let's find the end of the Top HUD
    for i in range(top_hud_idx, len(lines)):
        if '{/* Story Log (Middle) */}' in lines[i]:
            story_log_idx = i
            break
            
    # We will rewrite the Top HUD block
    # It starts at top_hud_idx and ends right before story_log_idx
    # We want it to be a very compact header on mobile.
    
    new_top_hud = """
        {/* Top HUD */}
        <div className="flex flex-col gap-2 mb-2 w-full max-w-5xl mx-auto z-10">
          
          <div className="flex items-center justify-between bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-lg">
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-rpg-magic shadow-[0_0_10px_rgba(197,160,89,0.3)] shrink-0 hidden sm:block">
                <img src={`https://image.pollinations.ai/prompt/epic%20high%20fantasy%20portrait%20of%20a%20${encodeURIComponent(race)}%20${encodeURIComponent(dndClass)}%20RPG%20character?width=128&height=128&nologo=true&seed=42`} alt={name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-lg sm:text-xl font-cinzel text-white font-bold drop-shadow-md leading-tight">{name} <span className="text-rpg-magic text-xs">Lv.{level}</span></h2>
                <div className="text-gray-400 font-lora text-xs">
                  {race} {dndClass}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2" title="Životy">
                <Heart size={16} className="text-rpg-blood" />
                <div className="font-cinzel text-white text-sm sm:text-base font-bold">
                  <span className={hp <= 20 ? 'text-rpg-blood animate-pulse' : ''}>{hp}</span><span className="text-gray-500 text-xs">/100</span>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2" title="Zásoby">
                <Drumstick size={16} className={rations < 2 ? "text-rpg-blood animate-pulse" : "text-orange-400"} />
                <div className="font-cinzel text-white text-sm sm:text-base font-bold">{rations}</div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2" title="Zlato">
                <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black text-[10px] shadow-[0_0_8px_rgba(234,179,8,0.5)]">Z</div>
                <div className="font-cinzel text-white text-sm sm:text-base font-bold">{gold}</div>
              </div>
            </div>

          </div>

          <div className="flex gap-1 sm:gap-2 bg-black/40 backdrop-blur-md border border-white/10 p-1 sm:p-2 rounded-2xl shadow-xl overflow-x-auto custom-scrollbar hide-scrollbar snap-x flex-nowrap">
            <button onClick={() => setStatsOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition flex items-center gap-2 text-sm font-cinzel"><User size={18} /> <span className="hidden sm:inline">Vlastnosti</span></button>
            <button onClick={() => setInventoryOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition flex items-center gap-2 text-sm font-cinzel"><Package size={18} /> <span className="hidden sm:inline">Batoh</span></button>
            <button onClick={() => setJournalOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition flex items-center gap-2 text-sm font-cinzel relative">
              <BookOpen size={18} /> <span className="hidden sm:inline">Deník</span>
              {unreadQuests && <span className="absolute top-1 right-1 w-2 h-2 bg-rpg-blood rounded-full animate-pulse" />}
            </button>
            <button onClick={() => setNpcsOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition flex items-center gap-2 text-sm font-cinzel"><Users size={18} /> <span className="hidden sm:inline">Postavy</span></button>
            <button onClick={() => setMapOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-3 text-rpg-magic hover:bg-rpg-magic/20 rounded-xl transition flex items-center gap-2 text-sm font-cinzel"><Map size={18} /> <span className="hidden sm:inline">Mapa</span></button>
            <button onClick={() => setSettingsOpen(true)} className="flex-shrink-0 snap-start p-2 sm:p-3 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition"><Settings2 size={18} /></button>
          </div>
          
        </div>
"""
    
    # Replace lines between top_hud_idx and story_log_idx - 1
    for i in range(top_hud_idx, story_log_idx):
        lines[i] = ""
        
    lines[top_hud_idx] = new_top_hud

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
