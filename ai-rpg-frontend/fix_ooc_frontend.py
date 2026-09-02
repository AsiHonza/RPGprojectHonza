import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# Add Brain import
if "Brain" not in content:
    content = content.replace(
        "import { Play, Pause",
        "import { Play, Pause, Brain"
    )

# Add isOOC state
if "const [isOOC, setIsOOC]" not in content:
    content = content.replace(
        "const [journalOpen, setJournalOpen] = useState(false);",
        "const [journalOpen, setJournalOpen] = useState(false);\n  const [isOOC, setIsOOC] = useState(false);"
    )

# Update sendAction
if "[OOC/MYŠLENKA]" not in content:
    content = content.replace(
        'setHistory(prev => [...prev, { type: "player", text: actionText }]);',
        '''let finalActionText = actionText;
      if (isOOC) {
          finalActionText = `[OOC/MYŠLENKA] ${actionText}`;
      }
      setHistory(prev => [...prev, { type: "player", text: isOOC ? `🧠 ${actionText}` : actionText }]);
      setIsOOC(false);'''
    )
    content = content.replace(
        'action_text: actionText',
        'action_text: finalActionText'
    )

# Update UI for the input field
old_input_ui = """            <div className="flex gap-2">
              <input 
                type="text" 
                value={customAction}
                onChange={(e) => setCustomAction(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendAction(customAction)}
                placeholder="Kam povedou tv kroky prodou?" 
                className="flex-1 bg-[#1b262c] text-[#f4f1e1] p-3 rounded-lg border border-[#455a64] focus:outline-none focus:border-[#d4af37] placeholder-[#90a4ae]"
                disabled={loading}
              />
              <button 
                onClick={() => sendAction(customAction)}
                className="bg-[#b74b4b] hover:bg-[#8c3a3a] text-[#f4f1e1] px-6 py-3 rounded-lg font-bold transition disabled:opacity-50 flex items-center justify-center border-b-4 border-black/30"
                disabled={loading || !customAction.trim()}
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
            </div>"""
            
new_input_ui = """            <div className="flex gap-2 relative">
              <button
                onClick={() => setIsOOC(!isOOC)}
                className={`absolute left-3 top-1/2 -translate-y-1/2 transition ${isOOC ? 'text-[#b74b4b]' : 'text-[#455a64] hover:text-[#90a4ae]'}`}
                title="Vnitřní myšlenka (OOC) - zastaví čas a herní události"
              >
                <Brain size={24} />
              </button>
              <input 
                type="text" 
                value={customAction}
                onChange={(e) => setCustomAction(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendAction(customAction)}
                placeholder={isOOC ? "Tvá vnitřní myšlenka... (čas stojí)" : "Kam povedou tvé kroky přírodou?"} 
                className={`flex-1 ${isOOC ? 'bg-[#1e2a3b] text-[#a4c2f4] italic border-[#b74b4b]' : 'bg-[#1b262c] text-[#f4f1e1] border-[#455a64]'} pl-12 pr-3 py-3 rounded-lg border focus:outline-none focus:border-[#d4af37] placeholder-[#90a4ae] transition-colors`}
                disabled={loading}
              />
              <button 
                onClick={() => sendAction(customAction)}
                className="bg-[#b74b4b] hover:bg-[#8c3a3a] text-[#f4f1e1] px-6 py-3 rounded-lg font-bold transition disabled:opacity-50 flex items-center justify-center border-b-4 border-black/30"
                disabled={loading || !customAction.trim()}
              >
                {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
              </button>
            </div>"""

import re
# We need to do a regex replace because of encoding mismatches with `tvé kroky přírodou?`
content = re.sub(
    r'<div className="flex gap-2">.*?<input.*?value=\{customAction\}.*?<button.*?sendAction\(customAction\).*?</button>.*?</div>',
    new_input_ui,
    content,
    flags=re.DOTALL
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Added OOC toggle frontend.")
