import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start_idx = -1
end_idx = -1
count = 0
for i, l in enumerate(lines):
    if 'if (gameState === "menu") {' in l:
        start_idx = i
        count = 1
        for j in range(i+1, len(lines)):
            if '{' in lines[j]: count += lines[j].count('{')
            if '}' in lines[j]: count -= lines[j].count('}')
            if count == 0:
                end_idx = j
                break
        break

new_menu = """  if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 font-serif relative overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]">
        
        {/* Deep background fog */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black z-0 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-rpg-magic/10 blur-[120px] rounded-full z-0 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full z-10 relative flex flex-col items-center"
        >
          <div className="mb-12 text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-rpg-magic tracking-[0.2em] font-cinzel drop-shadow-[0_0_20px_rgba(197,160,89,0.5)]">
              AELTHGARD
            </h1>
            <p className="text-gray-400 font-lora text-xl tracking-widest mt-4 uppercase">AI Dungeons & Dragons RPG</p>
          </div>

          {!isLoggedIn ? (
            <div className="w-full max-w-sm bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full p-3 bg-transparent border-b-2 border-white/20 focus:border-rpg-magic outline-none text-white font-lora text-lg transition placeholder-white/30" 
                    placeholder="E-mail" 
                  />
                </div>
                <div>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full p-3 bg-transparent border-b-2 border-white/20 focus:border-rpg-magic outline-none text-white font-lora text-lg transition placeholder-white/30" 
                    placeholder="Heslo" 
                  />
                </div>
                
                <button 
                  onClick={() => handleAuth(isRegistering)}
                  disabled={loading || !email || !password}
                  className="w-full py-4 bg-white/5 border border-rpg-magic/50 text-rpg-magic font-cinzel font-bold text-xl rounded-xl hover:bg-rpg-magic/20 hover:shadow-[0_0_15px_rgba(197,160,89,0.4)] transition uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                >
                  {loading && <Loader2 size={24} className="animate-spin" />}
                  {isRegistering ? "Vytvořit Účet" : "Vstoupit"}
                </button>
                
                <div className="text-center mt-4">
                  <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-gray-500 hover:text-white font-lora transition"
                  >
                    {isRegistering ? "Zpět k přihlášení" : "Zaregistrovat se"}
                  </button>
                </div>
              </div>
            </div>
          ) : savedCharacters.length === 0 ? (
            <div className="text-center w-full max-w-sm bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
              <p className="text-gray-400 font-lora mb-6">Přihlášen: {email}</p>
              <button 
                onClick={() => setGameState("creation")}
                className="w-full py-4 bg-rpg-blood border border-red-900/50 text-white font-cinzel font-bold text-xl rounded-xl hover:bg-red-800 hover:shadow-[0_0_20px_rgba(183,75,75,0.6)] transition uppercase tracking-widest"
              >
                Zrození Hrdiny
              </button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-8">
              <div className="text-center">
                <h3 className="text-gray-400 font-lora text-lg">Tvé Legendy</h3>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-rpg-magic to-transparent mx-auto mt-2" />
              </div>

              <div className="flex flex-wrap justify-center gap-6 max-w-5xl">
                {savedCharacters.map((char, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative w-64 h-96 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-rpg-magic transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(197,160,89,0.3)]"
                    onClick={() => loadGame(char.name)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                    
                    <img 
                      src={`https://image.pollinations.ai/prompt/dark%20fantasy%20portrait%20of%20a%20${encodeURIComponent(char.race)}%20${encodeURIComponent(char.dnd_class)}%20RPG%20character?width=512&height=768&nologo=true&seed=${char.name.length * 42}`} 
                      alt={char.name} 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500" 
                    />
                    
                    <div className="absolute inset-0 z-20 flex flex-col p-6">
                      <div className="ml-auto">
                        <button 
                          onClick={(e) => deleteCharacter(e, char.name)}
                          className="p-2 text-white/30 hover:text-rpg-blood hover:bg-red-900/30 rounded-full transition"
                          title="Smazat postavu"
                        >
                          <Flame size={20} />
                        </button>
                      </div>
                      
                      <div className="mt-auto">
                        <h4 className="text-2xl font-cinzel font-bold text-white group-hover:text-rpg-magic transition drop-shadow-lg">{char.name}</h4>
                        <div className="text-rpg-magic font-lora italic mt-1 drop-shadow-md">{char.race} {char.dnd_class}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => setGameState("creation")}
                className="mt-4 px-8 py-3 bg-transparent border border-white/20 text-white font-cinzel rounded-xl hover:bg-white/5 hover:border-white/50 transition uppercase tracking-widest text-sm flex items-center gap-2"
              >
                <Sparkles size={16} />
                Vytvořit Novou Legendu
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }\n"""

lines = lines[:start_idx] + [new_menu] + lines[end_idx+1:]

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
