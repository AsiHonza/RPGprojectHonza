import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

target = """                  {locationType === 'mesto' && pointsOfInterest.map((poi, i) => (
                    <button 
                      key={`poi-${i}`} 
                      onClick={() => sendAction(`Jdu prozkoumat: ${poi.nazev}`)}
                      className="bg-[#d4af37] text-[#1a120b] font-bold px-4 py-2 rounded-sm text-sm hover:bg-[#f4ecd8] transition-all shadow-md border border-[#d4af37] font-serif flex items-center gap-1"
                    >
                      <MapPin size={16} className="opacity-70" /> {poi.nazev}
                    </button>
                  ))}"""

replacement = """                  {locationType === 'mesto' && pointsOfInterest.map((poi, i) => (
                    <button 
                      key={`poi-${i}`} 
                      onClick={() => sendAction(`Jdu prozkoumat: ${poi.nazev}`)}
                      className="bg-[#d4af37] text-[#1a120b] font-bold px-4 py-2 rounded-sm text-sm hover:bg-[#f4ecd8] transition-all shadow-md border border-[#d4af37] font-serif flex items-center gap-1 relative"
                    >
                      {poi.ma_ukol && <div className="absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shadow-lg animate-bounce">!</div>}
                      <MapPin size={16} className="opacity-70" /> {poi.nazev}
                    </button>
                  ))}
                  {locationType === 'mesto' && (
                    <button 
                      onClick={() => sendAction(`Vyrážím na cestu. Očekávám dobrodružství a odepíšu si 1 dávku jídla.`)}
                      className="bg-[#3d2b1f] text-[#f4ecd8] font-bold px-4 py-2 rounded-sm text-sm hover:bg-[#2a1d15] transition-all shadow-md border border-[#5c4a3d] font-serif flex items-center gap-1 ml-4"
                    >
                      Vyrazit na cestu (1 🍗)
                    </button>
                  )}"""

content = content.replace(target, replacement)

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)
print("Travel button and ! added!")
