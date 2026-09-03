import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

new_logic = """  useEffect(() => {
    const savedEmail = localStorage.getItem("aethelgard_session_email");
    const savedChar = localStorage.getItem("aethelgard_active_char");
    
    if (savedEmail) {
      setEmail(savedEmail);
      setIsLoggedIn(true);
      fetchCharacters(savedEmail);
      
      if (savedChar) {
        // Auto resume game!
        loadGame(savedChar, savedEmail);
      }
    }
  }, []);"""

start = -1
for i, l in enumerate(lines):
    if 'useEffect(() => {' in l and 'const savedEmail' in lines[i+1]:
        start = i
        break

if start != -1:
    lines[start:start+8] = [new_logic + "\n"]

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
