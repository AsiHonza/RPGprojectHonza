import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Inject custom CSS inside the main "playing" return block
css_string = """
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.4s ease-out forwards;
          }
          @keyframes flashHighlight {
            0% { color: #f4ecd8; text-shadow: none; transform: scale(1); }
            30% { color: #ffd700; text-shadow: 0 0 10px #ffd700; transform: scale(1.2); }
            100% { color: inherit; text-shadow: none; transform: scale(1); }
          }
          .animate-flash {
            animation: flashHighlight 0.8s ease-out;
            display: inline-block;
          }
          @keyframes breath {
            0%, 100% { opacity: 0.85; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.02); }
          }
          .animate-breath {
            animation: breath 6s infinite ease-in-out;
          }
          @keyframes combatPulse {
            0%, 100% { box-shadow: 0 0 0px rgba(139,30,30,0); }
            50% { box-shadow: 0 0 20px rgba(139,30,30,0.5); }
          }
          .animate-combat {
            animation: combatPulse 2s infinite;
          }
          .thinking-dot {
            animation: fadeInUp 1s infinite alternate;
          }
          .thinking-dot:nth-child(2) { animation-delay: 0.2s; }
          .thinking-dot:nth-child(3) { animation-delay: 0.4s; }
        `}</style>
"""
content = content.replace('  if (gameState === "playing") {\n    return (\n      <div', '  if (gameState === "playing") {\n    return (\n      <div')
# Let's place it right after `<div className="flex h-screen bg-[#1a120b] font-serif text-[#3d2b1f] overflow-hidden">`
content = content.replace('<div className="flex h-screen bg-[#1a120b] font-serif text-[#3d2b1f] overflow-hidden">', '<div className={`flex h-screen bg-[#1a120b] font-serif text-[#3d2b1f] overflow-hidden ${inCombat ? "animate-combat border-4 border-[#8b1e1e]" : ""}`}>\n' + css_string)

# 2. Add animate-fade-in-up to chat messages
# The user chat is `<div key={idx} className="flex justify-end">`
# The DM chat is `<div key={idx} className="flex gap-4">`
content = content.replace('className="flex justify-end"', 'className="flex justify-end animate-fade-in-up"')
content = content.replace('className="flex gap-4"', 'className="flex gap-4 animate-fade-in-up"')

# 3. Add Breathing animation to the main location image
content = content.replace(
    '<img src={currentLocationImage} alt="Lokace" className="w-full h-full object-cover opacity-80" />',
    '<img src={currentLocationImage} alt="Lokace" className="w-full h-full object-cover animate-breath" />'
)
# And the character image in menu (if any)
# But mostly location image.

# 4. Flash animations for Top Bar using `key={value}` React trick
content = content.replace('{gold} gp', '<span key={`gold-${gold}`} className="animate-flash">{gold} gp</span>')
content = content.replace('{xp} / {level * 100} XP', '<span key={`xp-${xp}`} className="animate-flash">{xp}</span> / {level * 100} XP')
# Also HP
content = content.replace('{hp} / {stats.con * 10} HP', '<span key={`hp-${hp}`} className="animate-flash text-[#8b1e1e] font-bold">{hp}</span> / {stats.con * 10} HP')

# 5. Add loading indicator in chat
loading_indicator = """
            {loading && (
              <div className="flex gap-4 animate-fade-in-up">
                <div className="w-12 h-12 flex-shrink-0 border-2 border-[#c4a47c] bg-[#3d2b1f] rounded-lg flex items-center justify-center font-bold text-[#c4a47c] text-xl font-medieval">
                  DM
                </div>
                <div className="bg-[#e8dcc4] border-2 border-[#c4a47c] p-4 rounded-lg flex items-center gap-2 text-[#5c4a3d] italic">
                  <span>Pán jeskyně přemýšlí</span>
                  <span className="flex gap-1">
                    <span className="thinking-dot">.</span>
                    <span className="thinking-dot">.</span>
                    <span className="thinking-dot">.</span>
                  </span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
"""
content = content.replace('<div ref={chatEndRef} />', loading_indicator)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Animations injected!")
