import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Add saving to localStorage in handleAuth (if not already done)
if "aethelgard_session_email" not in content:
    content = content.replace(
        'setIsLoggedIn(true);\n        fetchCharacters(email);',
        'setIsLoggedIn(true);\n        localStorage.setItem("aethelgard_session_email", email);\n        fetchCharacters(email);'
    )

# 2. Add useEffect before loadGame
if "localStorage.getItem(\"aethelgard_session_email\")" not in content:
    target = '  const loadGame = async (characterName: string) => {'
    insertion = """
  useEffect(() => {
    const savedEmail = localStorage.getItem("aethelgard_session_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setIsLoggedIn(true);
      fetchCharacters(savedEmail);
    }
  }, []);

"""
    content = content.replace(target, insertion + target)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Auth persistence added!")
