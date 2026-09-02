import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Add state variable
state_injection = '  const [gameState, setGameState] = useState<"menu" | "creation" | "playing">("menu");\n  const [actionsOpen, setActionsOpen] = useState(false);'
content = content.replace('  const [gameState, setGameState] = useState<"menu" | "creation" | "playing">("menu");', state_injection)

# 2. Modify Action Area using regex
import re
pattern = r"(\{\/\* Suggested Actions or Combat Quick Actions \*\/\}\s*\{!loading && \(\s*)<div className=\"flex flex-wrap gap-2\">"
replacement = r"""\1<div className="flex flex-col gap-2">
            <button 
              onClick={() => setActionsOpen(!actionsOpen)} 
              className="md:hidden w-full bg-[#2b4c5e] border border-[#90a4ae] text-[#f4f1e1] px-4 py-2 rounded-sm text-sm hover:bg-[#455a64] transition-all font-bold flex justify-center items-center gap-2 shadow-md"
            >
              Vyrolovat akce {actionsOpen ? "▲" : "▼"}
            </button>
            <div className={`${actionsOpen ? 'flex' : 'hidden'} md:flex flex-wrap gap-2`}>"""

content = re.sub(pattern, replacement, content)

# 3. Find the end of the action block
pattern2 = r"(\s*\)\s*\}\s*\{\/\* Custom Action Input \*\/\})"
replacement2 = r"""
          </div>\1"""

content = re.sub(pattern2, replacement2, content)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Mobile actions collapsed!")
