import codecs

lines = codecs.open('src/features/map/MapModal.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'if (!isOpen || !worldData) return null;' in l:
        lines[i] = """  if (!isOpen) return null;
  if (!worldData) return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-rpg-obsidian border border-rpg-magic p-8 rounded-2xl max-w-md text-center shadow-[0_0_30px_rgba(197,160,89,0.3)]">
        <h2 className="text-3xl font-cinzel text-white mb-4">Mapa nenalezena</h2>
        <p className="text-gray-400 font-lora mb-6">Tato postava byla vytvotena pted aktualizac 7 Krlovstv, nebo dolo k chyb> pti generovn sv>ta. Pro pln zitek z kampan> si prosm zalo novou legendu!</p>
        <button onClick={onClose} className="bg-rpg-blood text-white px-6 py-2 rounded-xl font-cinzel hover:bg-red-700 transition">Zavtt</button>
      </div>
    </div>
  );
"""

with codecs.open('src/features/map/MapModal.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
