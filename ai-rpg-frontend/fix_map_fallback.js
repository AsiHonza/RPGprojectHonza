const fs = require('fs');

let content = fs.readFileSync('src/features/map/MapModal.tsx', 'utf8');

content = content.replace(
  'if (!isOpen || !worldData) return null;',
  `if (!isOpen) return null;
  if (!worldData) return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-rpg-obsidian border border-rpg-magic p-8 rounded-2xl max-w-md text-center shadow-[0_0_30px_rgba(197,160,89,0.3)]">
        <h2 className="text-3xl font-cinzel text-white mb-4">Mapa nenalezena</h2>
        <p className="text-gray-400 font-lora mb-6">Tato postava byla vytvořena před aktualizací 7 Království, nebo došlo k chybě při generování světa. Pro plný zážitek z kampaně si prosím založ novou legendu!</p>
        <button onClick={onClose} className="bg-rpg-blood text-white px-6 py-2 rounded-xl font-cinzel hover:bg-red-700 transition">Zavřít</button>
      </div>
    </div>
  );`
);
// Also fix the python corruption from previous step
content = content.replace(/Tato postava byla vytvotena pted aktualizac 7 Krlovstv, nebo dolo k chyb> pti generovn sv>ta. Pro pln zitek z kampan> si prosm zalo novou legendu!/g, "Tato postava byla vytvořena před aktualizací 7 Království, nebo došlo k chybě při generování světa. Pro plný zážitek z kampaně si prosím založ novou legendu!");
content = content.replace(/Zavtt/g, "Zavřít");

fs.writeFileSync('src/features/map/MapModal.tsx', content, 'utf8');
