import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start = -1
for i, l in enumerate(lines):
    if '{/* Custom Action Input */}' in l:
        start = i
        break

end = start
for i in range(start, len(lines)):
    if '</div>' in lines[i] and '      </div>' in lines[i+1] and '{/* End Right Column */}' in lines[i+2]:
        end = i
        break

new_input = """        {/* Magical Input */}
        <div className="relative mt-2">
          {/* Decorative magical border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-rpg-magic/20 to-transparent rounded-xl blur-sm"></div>
          
          <div className="relative flex gap-2 bg-[#111827]/90 backdrop-blur-md p-2 rounded-xl border border-rpg-magic/30 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => setIsOOC(!isOOC)}
              className={`px-3 transition-colors rounded-lg flex items-center justify-center ${isOOC ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.3)]' : 'text-[#455a64] hover:text-rpg-magic bg-[#1b262c] border border-transparent hover:border-rpg-magic/30'}`}
              title="Vnitřní myšlenka (OOC) - zastaví čas a herní události"
            >
              <Brain size={20} className={isOOC ? "animate-pulse" : ""} />
            </button>
            <input 
              type="text" 
              value={customAction}
              onChange={(e) => setCustomAction(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendAction(customAction)}
              placeholder={isOOC ? "Přemýšlím nad..." : "Co uděláš dál?"} 
              className={`flex-1 font-lora text-[17px] ${isOOC ? 'bg-indigo-950/30 text-indigo-200 italic placeholder-indigo-400/50' : 'bg-transparent text-rpg-paper placeholder-rpg-muted/50'} px-2 py-3 focus:outline-none transition-colors`}
              disabled={loading}
            />
            <button 
              onClick={() => sendAction(customAction)}
              className="bg-gradient-to-br from-red-800 to-rpg-blood hover:from-red-700 hover:to-red-900 text-rpg-paper px-6 py-2 rounded-lg font-cinzel font-bold tracking-wider transition-all disabled:opacity-50 flex items-center justify-center border border-rpg-blood/50 shadow-[0_0_10px_rgba(183,75,75,0.4)] hover:shadow-[0_0_15px_rgba(183,75,75,0.8)] relative overflow-hidden group"
              disabled={loading || !customAction.trim()}
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
              {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>\n"""

new_lines = lines[:start] + [new_input] + lines[end+1:]

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(new_lines))

print("Input refactored")
