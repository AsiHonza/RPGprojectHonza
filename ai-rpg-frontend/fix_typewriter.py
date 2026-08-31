import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

typewriter_component = """
const TypewriterText = ({ text, delay = 25, animate = false }: { text: string, delay?: number, animate?: boolean }) => {
  const [displayedText, setDisplayedText] = React.useState(animate ? "" : text);

  React.useEffect(() => {
    if (!animate) {
      setDisplayedText(text);
      return;
    }
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, delay);
    return () => clearInterval(interval);
  }, [text, animate, delay]);

  return <span>{displayedText}</span>;
};

export default function Home() {
"""

content = content.replace("export default function Home() {", typewriter_component)

# Now, replace {msg.vypravec} with <TypewriterText text={msg.vypravec} animate={idx === history.length - 1} />
# It is located here:
#                      <Volume2 size={20} />
#                    </button>
#                    {msg.vypravec}
#                  </div>

content = content.replace(
    '                    </button>\n                    {msg.vypravec}\n                  </div>',
    '                    </button>\n                    <TypewriterText text={msg.vypravec} animate={idx === history.length - 1} />\n                  </div>'
)

# Replace for NPC dialogues (player)
content = content.replace(
    '<span className="opacity-90">"{npc.text}"</span>',
    '<span className="opacity-90">"<TypewriterText text={npc.text} animate={idx === history.length - 1} />"</span>'
)

# Replace for NPC dialogues (others)
content = content.replace(
    '<span className="text-[#3d2b1f]">"{npc.text}"</span>',
    '<span className="text-[#3d2b1f]">"<TypewriterText text={npc.text} animate={idx === history.length - 1} />"</span>'
)

# Replace for legacy NPC
content = content.replace(
    '<span className="text-[#3d2b1f]">"{msg.npc_mluvi.text}"</span>',
    '<span className="text-[#3d2b1f]">"<TypewriterText text={msg.npc_mluvi.text} animate={idx === history.length - 1} />"</span>'
)


with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Typewriter injected!")
