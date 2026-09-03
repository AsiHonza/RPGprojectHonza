import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

hash_logic = """
  // Sync gameState to URL hash
  useEffect(() => {
    if (gameState) {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash !== gameState) {
        window.history.pushState(null, '', `#${gameState}`);
      }
    }
  }, [gameState]);

  // Handle browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'creation' && isLoggedIn) {
        setGameState('creation');
      } else if (hash === 'playing' && isLoggedIn) {
        // Can only go back to playing if we have an active character
        const savedChar = localStorage.getItem("aethelgard_active_char");
        if (savedChar) setGameState('playing');
        else setGameState('menu');
      } else {
        setGameState('menu');
      }
    };
    window.addEventListener('popstate', handlePopState);
    
    // Initial sync on mount
    if (isLoggedIn) {
      handlePopState();
    }
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isLoggedIn, setGameState]);
"""

for i, l in enumerate(lines):
    if '// Global interaction listener for Autoplay Policy' in l:
        lines.insert(i, hash_logic)
        break

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
