import codecs
import re

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Fix Player Header
content = content.replace(
    '<div className="w-full max-w-7xl bg-[#f4f1e1] border border-[#90a4ae] rounded-lg p-4 shadow-lg flex flex-col gap-2">',
    '<div className="w-full max-w-7xl bg-[#f4f1e1] border border-[#90a4ae] rounded-lg p-2 md:p-4 shadow-lg flex flex-col gap-2 shrink-0">'
)

# 2. Main Game Log - remove minHeight: "60vh" and ensure it shrinks
content = content.replace(
    'style={{ backgroundImage: "url(\'https://www.transparenttextures.com/patterns/aged-paper.png\')", minHeight: "60vh" }}>',
    'style={{ backgroundImage: "url(\'https://www.transparenttextures.com/patterns/aged-paper.png\')" }}>'
)
content = content.replace(
    'className="w-full max-w-4xl bg-[#f4f1e1] flex-1 overflow-y-auto p-4 md:p-8 border-x border-[#90a4ae] shadow-lg flex flex-col gap-6"',
    'className="w-full max-w-4xl mx-auto bg-[#f4f1e1] flex-1 overflow-y-auto p-3 md:p-8 border-x border-[#90a4ae] shadow-lg flex flex-col gap-4 md:gap-6"'
)

# 3. Action Area - make it shrink-0 and responsive padding
content = content.replace(
    '<div className="w-full bg-[#1e3746] border-t-4 border-[#b74b4b] p-5 flex flex-col gap-5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-10">',
    '<div className="w-full bg-[#1e3746] border-t-4 border-[#b74b4b] p-3 md:p-5 flex flex-col gap-3 md:gap-5 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] z-10 shrink-0">'
)

# 4. Global Wrapper - reduce gap/padding on mobile
content = content.replace(
    '<div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#1b262c] p-2 md:p-6 font-serif flex flex-col items-center relative">',
    '<div className="h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#1b262c] p-1 md:p-6 gap-2 md:gap-4 font-serif flex flex-col items-center relative">'
)

# 5. Right column parent - fix layout
content = content.replace(
    '<div className="flex-1 flex flex-col overflow-hidden rounded-lg shadow-lg border border-[#90a4ae]">',
    '<div className="flex-1 flex flex-col overflow-hidden rounded-lg shadow-lg border border-[#90a4ae] relative">'
)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Mobile layout fixed!")
