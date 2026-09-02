import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start_idx = -1
end_idx = -1
for i, l in enumerate(lines):
    if "{/* Player Header */}" in l:
        start_idx = i
        break

for i in range(start_idx, len(lines)):
    if "{/* End 2-Column Container */}" in l:
        # wait, the string I search for is in lines[i]
        pass

for i in range(start_idx, len(lines)):
    if "{/* End 2-Column Container */}" in lines[i]:
        end_idx = i + 1 # Include the closing div after it
        break

new_ui = """      {/* --- AELTHGARD IMMERSIVE GAMEPLAY UI --- */}
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${currentLocationImage || 'https://www.transparenttextures.com/patterns/black-scales.png'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 backdrop-blur-sm" />
      </div>

      <div className="w-full max-w-7xl flex flex-col h-full relative z-10 p-2 md:p-6 pb-0">
        
        {/* Top HUD */}
        <div className="flex justify-between items-start mb-4">
          
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-rpg-magic shadow-[0_0_15px_rgba(197,160,89,0.3)] shrink-0">
              <img src={`https://image.pollinations.ai/prompt/dark%20fantasy%20portrait%20of%20a%20${encodeURIComponent(race)}%20${encodeURIComponent(dndClass)}%20RPG%20character?width=128&height=128&nologo=true&seed=42`} alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-cinzel text-white font-bold drop-shadow-md">{name}</h2>
              <div className="text-rpg-magic font-lora text-sm flex gap-3">
                <span>Úroveň {level}</span>
                <span className="opacity-50">|</span>
                <span>{race} {dndClass}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 max-w-[50%]">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10" title="Životy">
              <Heart size={20} className="text-rpg-blood" />
              <div className="font-cinzel text-white text-lg font-bold">
                <span className={hp <= 20 ? 'text-rpg-blood animate-pulse' : ''}>{hp}</span><span className="text-gray-500 text-sm">/100</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10" title="Zásoby">
              <Drumstick size={20} className={rations < 2 ? "text-rpg-blood animate-pulse" : "text-orange-400"} />
              <div className="font-cinzel text-white text-lg font-bold">{rations}</div>
            </div>

            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10" title="Zlato">
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-black text-xs shadow-[0_0_8px_rgba(234,179,8,0.5)]">Z</div>
              <div className="font-cinzel text-white text-lg font-bold">{gold}</div>
            </div>
          </div>

        </div>

        {/* Story Log (Middle) */}
        <div className="flex-1 overflow-hidden relative mb-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6" ref={chatRef}>
            
            {history.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === "player" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] md:max-w-[75%] p-5 rounded-2xl ${
                  msg.type === "player" 
                    ? "bg-white/5 border border-white/10 text-gray-300 font-lora" 
                    : msg.type === "system" 
                      ? "bg-black border border-white/5 text-gray-400 font-cinzel text-sm italic"
                      : "bg-black/60 border border-rpg-magic/30 text-white font-lora shadow-[0_0_15px_rgba(197,160,89,0.1)]"
                }`}>
                  {msg.type === "model" && (
                    <button onClick={() => playAudio(msg.text, 'narrator')} className="float-right ml-4 text-gray-500 hover:text-rpg-magic transition">
                      <Volume2 size={18} />
                    </button>
                  )}
                  {msg.type === "system" ? <FormattedSystemLog text={msg.text} /> : (
                    <div className="leading-relaxed text-lg">
                      {msg.type === "model" ? <TypewriterText text={msg.text} animate={i === history.length - 1} /> : msg.text}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-fade-in-up">
                <div className="bg-black/60 border border-rpg-magic/30 p-5 rounded-2xl flex items-center gap-3 text-rpg-magic italic font-lora">
                  <Sparkles className="animate-spin" size={20} />
                  <span>Vypravěč spřádá osud...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Bottom Actions & Input */}
        <div className="shrink-0 flex flex-col gap-4 pb-4">
          
          {/* Action Buttons & Dock */}
          <div className="flex flex-wrap justify-between items-end gap-4">
            
            {/* Contextual Actions */}
            <div className="flex flex-wrap gap-2 flex-1">
              {inCombat ? (
                <>
                  <button onClick={() => sendAction(`Útočím zbraní: ${inventory.find(i => i.id === equipped["hlavní ruka"])?.name || "Pěsti"}`)} className="bg-rpg-blood/20 border border-rpg-blood text-white px-4 py-2 rounded-xl text-sm hover:bg-rpg-blood transition shadow-[0_0_10px_rgba(183,75,75,0.2)] font-cinzel flex items-center gap-2">
                    <Sword size={16} /> Útok
                  </button>
                  <button onClick={() => setSkillsOpen(true)} className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-xl text-sm hover:bg-white/10 transition font-cinzel flex items-center gap-2">
                    <Sparkles size={16} /> Dovednost
                  </button>
                  <button onClick={() => sendAction("Pokusím se z boje utéct!")} className="bg-black/40 border border-gray-600 text-gray-400 px-4 py-2 rounded-xl text-sm hover:text-white transition font-cinzel italic">
                    Útěk
                  </button>
                </>
              ) : (
                <>
                  {locationType === 'mesto' && pointsOfInterest.map((poi, i) => (
                    <button key={`poi-${i}`} onClick={() => sendAction(`Jdu prozkoumat: ${poi.nazev}`)} className="bg-rpg-magic/10 border border-rpg-magic/50 text-rpg-magic px-4 py-2 rounded-xl text-sm hover:bg-rpg-magic hover:text-black transition font-cinzel flex items-center gap-2 shadow-[0_0_10px_rgba(197,160,89,0.2)]">
                      <MapPin size={16} /> {poi.nazev}
                    </button>
                  ))}
                  {suggestedActions.map((act, i) => (
                    <button key={`act-${i}`} onClick={() => sendAction(act)} className="bg-white/5 border border-white/20 text-gray-300 px-4 py-2 rounded-xl text-sm hover:bg-white/10 hover:text-white transition font-lora">
                      {act}
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* Menu Dock */}
            <div className="flex gap-2 bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-xl">
              <button onClick={() => setStatsOpen(true)} className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition" title="Vlastnosti"><User size={20} /></button>
              <button onClick={() => setInventoryOpen(true)} className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition" title="Batoh"><Package size={20} /></button>
              <button onClick={() => setJournalOpen(true)} className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition relative" title="Deník">
                <BookOpen size={20} />
                {unreadQuests && <span className="absolute top-2 right-2 w-2 h-2 bg-rpg-blood rounded-full animate-pulse" />}
              </button>
              <button onClick={() => setNpcsOpen(true)} className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition" title="Postavy"><Users size={20} /></button>
              {worldData && <button onClick={() => setMapOpen(true)} className="p-3 text-rpg-magic hover:bg-rpg-magic/20 rounded-xl transition" title="Mapa"><Map size={20} /></button>}
              <button onClick={() => setSettingsOpen(true)} className="p-3 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition"><Settings2 size={20} /></button>
            </div>

          </div>

          {/* Magical Input Box */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-rpg-magic/20 to-transparent rounded-2xl blur-md" />
            <div className="relative flex gap-3 bg-black/80 backdrop-blur-xl p-3 rounded-2xl border border-rpg-magic/30 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
              <button
                onClick={() => setIsOOC(!isOOC)}
                className={`p-4 transition-all rounded-xl flex items-center justify-center ${isOOC ? 'bg-indigo-900/40 text-indigo-300 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'text-gray-500 hover:text-rpg-magic bg-white/5 border border-transparent'}`}
                title="OOC (Myšlenka)"
              >
                <Brain size={24} className={isOOC ? "animate-pulse" : ""} />
              </button>
              <input 
                type="text" 
                value={customAction}
                onChange={(e) => setCustomAction(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendAction(customAction)}
                placeholder={isOOC ? "Přemýšlím nad..." : "Co uděláš dál?"} 
                className={`flex-1 font-lora text-xl bg-transparent px-4 py-2 outline-none transition-colors ${isOOC ? 'text-indigo-200 placeholder-indigo-900' : 'text-white placeholder-gray-600'}`}
                disabled={loading}
              />
              <button 
                onClick={() => sendAction(customAction)}
                className="bg-rpg-blood hover:bg-red-800 text-white px-8 py-2 rounded-xl font-cinzel font-bold text-lg tracking-widest transition-all disabled:opacity-50 flex items-center justify-center shadow-[0_0_15px_rgba(183,75,75,0.4)]"
                disabled={loading || !customAction.trim()}
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : "Vydat se"}
              </button>
            </div>
          </div>

        </div>
      </div>
"""

lines = lines[:start_idx] + [new_ui] + lines[end_idx+1:]

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
