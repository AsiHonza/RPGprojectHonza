import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# We will find the entire `if (gameState === "menu") { ... }` block up to `if (gameState === "creation") {`
start_idx = content.find('if (gameState === "menu") {')
end_idx = content.find('if (gameState === "creation") {')

if start_idx != -1 and end_idx != -1:
    old_menu = content[start_idx:end_idx]
    
    new_menu = """if (gameState === "menu") {
    return (
      <div className="min-h-screen bg-[#1a120b] flex items-center justify-center p-4 font-serif">
        <div className="max-w-md w-full bg-[#f4ecd8] rounded shadow-2xl p-8 border border-[#c4a47c] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-[#8b1e1e] to-transparent"></div>
          <h1 className="text-4xl font-bold text-center text-[#3d2b1f] mb-2 tracking-wider font-medieval">AETHELGARD</h1>
          <p className="text-center text-[#5c4a3d] italic mb-8">AI Dungeons & Dragons RPG</p>
          
          <div className="space-y-4">
            {!isLoggedIn ? (
              <>
                <div>
                  <label className="block font-bold mb-1 text-sm text-[#3d2b1f]">E-mail</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full p-2 bg-[#e8dcc4] border border-[#c4a47c] rounded outline-none focus:ring-2 focus:ring-[#8b1e1e] mb-4 text-[#3d2b1f]" 
                    placeholder="tvuj@email.cz" 
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1 text-sm text-[#3d2b1f]">Heslo</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full p-2 bg-[#e8dcc4] border border-[#c4a47c] rounded outline-none focus:ring-2 focus:ring-[#8b1e1e] mb-4 text-[#3d2b1f]" 
                    placeholder="Heslo" 
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAuth(false)}
                    disabled={loading || !email || !password}
                    className="w-1/2 py-3 bg-[#e8dcc4] border-2 border-[#8b1e1e] text-[#8b1e1e] font-bold rounded hover:bg-[#8b1e1e] hover:text-[#f4ecd8] transition uppercase tracking-widest disabled:opacity-50"
                  >
                    Přihlásit
                  </button>
                  <button 
                    onClick={() => handleAuth(true)}
                    disabled={loading || !email || !password}
                    className="w-1/2 py-3 bg-[#8b1e1e] border-2 border-[#8b1e1e] text-[#f4ecd8] font-bold rounded hover:bg-[#b22222] transition uppercase tracking-widest disabled:opacity-50"
                  >
                    Registrovat
                  </button>
                </div>
              </>
            ) : savedCharacters.length === 0 ? (
              <div className="text-center">
                <p className="text-[#3d2b1f] mb-4 font-bold">Přihlášen jako: {email}</p>
                <button 
                  onClick={() => setGameState("creation")}
                  className="w-full py-3 bg-[#8b1e1e] border-2 border-[#8b1e1e] text-[#f4ecd8] font-bold rounded hover:bg-[#b22222] transition uppercase tracking-widest"
                >
                  Vytvořit první postavu
                </button>
              </div>
            ) : (
              <div className="space-y-2 mt-4">
                <div className="text-center text-[#5c4a3d] font-bold mb-2">Účet: {email}</div>
                <h3 className="text-center text-[#8b1e1e] font-bold mb-2 uppercase text-sm tracking-wider">Vyber postavu:</h3>
                {savedCharacters.map((char, idx) => (
                  <button 
                    key={idx}
                    onClick={() => loadGame(char.name)}
                    className="w-full p-3 bg-[#e8dcc4] border border-[#c4a47c] text-left rounded hover:border-[#8b1e1e] transition group flex items-center gap-3"
                  >
                    <div className="w-10 h-10 border border-[#8b1e1e] rounded overflow-hidden flex-shrink-0 bg-[#3d2b1f]">
                      <img src={`https://image.pollinations.ai/prompt/black%20and%20white%20ink%20drawing%20of%20a%20${encodeURIComponent(char.race)}%20${encodeURIComponent(char.dnd_class)}%20RPG%20character%20portrait?width=128&height=128&nologo=true&seed=42`} alt={char.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" />
                    </div>
                    <div>
                      <div className="font-bold text-[#3d2b1f] group-hover:text-[#8b1e1e] transition">{char.name}</div>
                      <div className="text-xs text-[#5c4a3d]">{char.race} {char.dnd_class}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {isLoggedIn && (
              <>
                <div className="relative py-2 mt-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#c4a47c]"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#f4ecd8] px-2 text-[#5c4a3d] text-sm">nebo</span>
                  </div>
                </div>

                <button 
                  onClick={() => setGameState("creation")}
                  className="w-full py-3 bg-[#3d2b1f] text-[#f4ecd8] font-bold rounded hover:bg-[#2a1d15] transition uppercase tracking-widest shadow-lg"
                >
                  Založit novou postavu
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  """
    content = content[:start_idx] + new_menu + content[end_idx:]

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Menu completely replaced!")
