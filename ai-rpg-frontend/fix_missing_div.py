import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Fix missing div
content = content.replace(
    '          </div>\n        \n        {/* XP Bar */}',
    '          </div>\n        </div>\n        \n        {/* XP Bar */}'
)

# 2. Add the missing Quest Banner
banner_ui = """      {/* Epic Quest Banner */}
      {questBanner && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center">
           <div className="animate-in fade-in zoom-in duration-500 flex flex-col items-center bg-black/70 px-12 py-6 border-y-4 border-[#d4af37] shadow-[0_0_50px_rgba(212,175,55,0.4)] backdrop-blur-sm">
             <div className="text-[#d4af37] text-xs sm:text-sm font-bold tracking-[0.4em] uppercase mb-2">{questBanner.title}</div>
             <div className="text-[#f4f1e1] text-xl sm:text-3xl font-serif drop-shadow-lg text-center max-w-md">{questBanner.subtitle}</div>
           </div>
        </div>
      )}
"""
if "{/* Epic Quest Banner */}" not in content:
    content = content.replace(
        '{/* Nativn',
        banner_ui + '\n      {/* Nativn'
    )

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Syntax fixed and banner added.")
