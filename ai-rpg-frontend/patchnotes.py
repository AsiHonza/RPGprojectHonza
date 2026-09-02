import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    content = f.read()

# 1. Ensure icons are imported (Sparkles and ScrollText are already imported in previous step, let's verify or add Bell/FileText)
# We will use Sparkles or ScrollText.
if "ScrollText" not in content:
    content = content.replace("Settings2", "Settings2, ScrollText")

# 2. Add PATCH_NOTES constant
patch_notes_const = """
const PATCH_NOTES = [
  {
    version: "v1.2.0 - Vládci Osudu & Objevitelé",
    date: "Září 2026",
    changes: [
      "🗺️ Řízený Sandbox: Nový kampaňový režim hry! AI pro tebe při založení postavy vymyslí pevnou mapu, zápletku a skrytá tajemství.",
      "📜 Interaktivní Mapa: Hraješ-li kampaň, máš nově přístup k interaktivní vizuální mapě světa a objevených cest.",
      "🏕️ Epické Cestování: Každý krok cesty do nové lokace stojí 1 jídlo. Pán jeskyně hází tajně d20 kostkou na události (od klidné cesty po smrtící léčku).",
      "👥 Deník Postav (Kodex): V horním menu nově najdeš vizitkář! Hra si pamatuje každé důležité NPC a jejich vztah k tobě (zelená/žlutá/červená).",
      "📱 Mobilní UI & Notifikace: Kompaktní rozhraní pro telefony a epické 'Skyrim-style' oznámení přes celou obrazovku, když splníš quest!"
    ]
  },
  {
    version: "v1.1.0 - Magie a Ocel",
    date: "Starší",
    changes: [
      "✨ Systém kouzel a cantripů pro magická povolání.",
      "⚔️ Zbraně, zbroje a možnost se vybavovat z inventáře.",
      "🎵 Adaptivní ambientní hudba (Město, Divočina, Boj)."
    ]
  }
];

"""
if "const PATCH_NOTES =" not in content:
    content = content.replace("export default function Game() {", patch_notes_const + "export default function Game() {")

# 3. Add state hook
if "const [patchNotesOpen" not in content:
    content = content.replace(
        'const [settingsOpen, setSettingsOpen] = useState(false);',
        'const [settingsOpen, setSettingsOpen] = useState(false);\n  const [patchNotesOpen, setPatchNotesOpen] = useState(false);'
    )

# 4. Add Top Bar Button
button_html = """            {/* Patch Notes Button */}
            <button onClick={() => setPatchNotesOpen(true)} className="text-[#b74b4b] hover:text-[#d4af37] transition flex items-center gap-1 font-bold bg-[#1b262c] px-2 py-1 rounded border border-[#90a4ae]" title="Novinky ve hře">
              <ScrollText size={20} />
              <span className="hidden sm:inline text-xs uppercase">Novinky</span>
            </button>
            <button onClick={() => setSettingsOpen(true)"""
content = content.replace('<button onClick={() => setSettingsOpen(true)', button_html)

# 5. Add Patch Notes Modal
modal_html = """
      {/* Patch Notes Modal */}
      {patchNotesOpen && (
        <div className="absolute inset-0 bg-black/80 z-[110] flex items-center justify-center p-4 font-serif">
          <div className="bg-[#f4f1e1] border-2 border-[#b74b4b] rounded max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden bg-[url('/assets/parchment.jpg')] bg-cover">
            <div className="flex justify-between items-center p-4 border-b-2 border-[#b74b4b] bg-[#1b262c]/90">
              <div className="flex items-center gap-2 text-[#d4af37] font-bold text-2xl uppercase tracking-widest font-medieval">
                <ScrollText size={28} /> Kronika Změn (Patchnotes)
              </div>
              <button onClick={() => setPatchNotesOpen(false)} className="text-[#90a4ae] hover:text-[#b74b4b] transition">
                <X size={28} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-8">
              {PATCH_NOTES.map((patch, idx) => (
                <div key={idx} className="bg-[#1b262c]/10 border border-[#90a4ae] rounded p-5 shadow-sm">
                  <div className="flex justify-between items-end border-b border-[#90a4ae] pb-2 mb-4">
                    <h2 className="text-[#b74b4b] font-bold text-xl font-medieval tracking-wide">{patch.version}</h2>
                    <span className="text-[#455a64] text-xs font-bold uppercase">{patch.date}</span>
                  </div>
                  <ul className="space-y-3">
                    {patch.changes.map((change, cIdx) => (
                      <li key={cIdx} className="text-[#2b4c5e] flex gap-3 text-sm md:text-base leading-relaxed">
                        <span className="shrink-0 text-lg mt-[-2px]">{change.split(' ')[0]}</span>
                        <span>{change.substring(change.indexOf(' ') + 1)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
"""
if "{/* Patch Notes Modal */}" not in content:
    content = content.replace('{/* Settings Modal */}', modal_html + '\n      {/* Settings Modal */}')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.write(content)

print("Patch notes added.")
