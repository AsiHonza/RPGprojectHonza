import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

formatted_log_component = """
// Helper component to colorize system logs
const FormattedSystemLog = ({ text }: { text: string }) => {
  // Split by lines first
  const lines = text.split('\\n').map((line, idx) => {
    // Basic regex highlights
    let html = line
      .replace(/(Selhání\.|Selhání!)/gi, '<span class="text-red-600 font-bold">$1</span>')
      .replace(/(Úspěch\.|Úspěch!|Kritický úspěch!)/gi, '<span class="text-green-600 font-bold">$1</span>')
      .replace(/(Hráč ztrácí \d+ HP|ztrácíš \d+ HP|způsobuje \d+ bodů.*poškození)/gi, '<span class="text-red-600 font-bold">$1</span>')
      .replace(/(d\d+\(\d+\))/g, '<span class="text-yellow-600 font-bold">$1</span>')
      .replace(/(\d+ vs DC \d+)/g, '<span class="text-yellow-600 font-bold">$1</span>')
      .replace(/(vs AC \d+)/g, '<span class="text-yellow-600 font-bold">$1</span>')
      .replace(/(Útok vlka|Útok nepřítele|Útok skřeta|Útok orka)/gi, '<span class="text-red-500 font-bold">$1</span>')
      .replace(/(Útok hráče.*?:)/gi, '<span class="text-green-500 font-bold">$1</span>')
      .replace(/(Zásah!)/g, '<span class="font-bold border-b-2 border-red-400">$1</span>'); // Universal highlight for hits
    
    return (
      <div key={idx} className="mb-1 last:mb-0" dangerouslySetInnerHTML={{ __html: html }} />
    );
  });
  return <div className="font-serif text-base text-[#2b4c5e]">{lines}</div>;
};
"""

# Insert component before Home
if "FormattedSystemLog" not in content:
    content = content.replace(
        'export default function Home() {',
        formatted_log_component + '\nexport default function Home() {'
    )

# Replace the pre block
old_pre = '<pre className="whitespace-pre-wrap break-words font-serif italic text-base">{msg.system_log}</pre>'
new_pre = '<FormattedSystemLog text={msg.system_log} />'
content = content.replace(old_pre, new_pre)

# Now, we also need to fix the enemy missing keys.
# The user's screenshot shows empty enemy name and hp. Why? 
# Maybe the backend generates `jméno` instead of `jmeno`.
# Let's check where the enemy state is populated in frontend:
# `if (data.nepratele) setEnemies(data.nepratele);`
# `enemies.map((enemy, idx) => ( ... {enemy.jmeno} ... {enemy.hp} ... ))`
# If enemy has `jméno`, it won't render. We should support both `jmeno` and `jméno` (and `name`), and `hp` and `HP`, etc.

enemy_render_old = """                          <span>{enemy.jmeno}</span>
                          <span className="text-red-400">{enemy.hp}/{enemy.max_hp}</span>"""
enemy_render_new = """                          <span>{enemy.jmeno || enemy.jméno || enemy.name || "Neznámý"}</span>
                          <span className="text-red-400">{enemy.hp ?? enemy.HP ?? 0}/{enemy.max_hp ?? enemy.MAX_HP ?? 0}</span>"""
content = content.replace(enemy_render_old, enemy_render_new)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("System log and enemy UI fixed!")
