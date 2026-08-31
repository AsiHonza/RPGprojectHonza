import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. State Variables
old_states = """  const [apiKey, setApiKey] = useState("");
  const [name, setName] = useState("");"""
new_states = """  const [apiKey, setApiKey] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");"""
content = content.replace(old_states, new_states)

# 2. Auth Functions
auth_functions = """  const handleAuth = async (isRegister: boolean) => {
    setLoading(true);
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Authentication failed");
      
      setIsLoggedIn(true);
      fetchCharacters(email);
    } catch (error: any) {
      alert("Chyba přihlášení: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCharacters = async (userEmail = email) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/list-characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail);
      setSavedCharacters(data.characters);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
"""

# Replace old fetchCharacters with auth_functions
content = re.sub(r'const fetchCharacters = async \(\) => \{.*?\};\n', auth_functions, content, flags=re.DOTALL)

# 3. Update loadGame, sendAction, createCharacter to include email and apiKey
content = content.replace('body: JSON.stringify({ api_key: apiKey, name: characterName })', 'body: JSON.stringify({ api_key: apiKey || "TEST_KEY", email: email, name: characterName })')
content = content.replace('body: JSON.stringify({ api_key: apiKey, name, action_text: action, stats })', 'body: JSON.stringify({ api_key: apiKey || "TEST_KEY", email: email, name, action_text: action, stats })')
content = content.replace('body: JSON.stringify({ name, dnd_class: dndClass, race, stats, api_key: apiKey, keywords })', 'body: JSON.stringify({ name, dnd_class: dndClass, race, stats, email: email, api_key: apiKey || "TEST_KEY", keywords })')

# 4. Update the Menu UI
menu_ui_old = """            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-1 text-sm text-[#3d2b1f]">Tvůj API Klíč (Tvůj účet)</label>
                <input 
                  type="password" 
                  value={apiKey} 
                  onChange={e => {
                    setApiKey(e.target.value);
                    setSavedCharacters([]); // Reset characters on key change
                  }} 
                  className="w-full p-2 bg-[#e8dcc4] border border-[#c4a47c] rounded outline-none focus:ring-2 focus:ring-[#8b1e1e] mb-4 text-[#3d2b1f]" 
                  placeholder="Zadej svůj klíč..." 
                />
              </div>
              
              {savedCharacters.length === 0 ? (
                <button 
                  onClick={fetchCharacters}
                  disabled={loading || !apiKey}
                  className="w-full py-3 bg-[#e8dcc4] border-2 border-[#8b1e1e] text-[#8b1e1e] font-bold rounded hover:bg-[#8b1e1e] hover:text-[#f4ecd8] transition uppercase tracking-widest disabled:opacity-50"
                >
                  {loading ? "Hledám postavy..." : "Přihlásit se"}
                </button>
              ) : ("""

menu_ui_new = """            <div className="space-y-4">
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
              ) : ("""

content = content.replace(menu_ui_old, menu_ui_new)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Auth UI integrated!")
