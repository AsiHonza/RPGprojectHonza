
const fs = require("fs");
const path = "src/features/character/CharacterCreation.tsx";
let code = fs.readFileSync(path, "utf8");

// Add imports
code = code.replace(
  "import { SeamlessVideo } from '../../components/ui/SeamlessVideo';",
  "import { SeamlessVideo } from '../../components/ui/SeamlessVideo';\nimport { calculateBaseStats } from '../../utils/statsCalculator';\nimport { RACES } from '../../data/races';"
);

// Add useEffect to update stats dynamically
const effectCode = `  const { 
    name, setName, 
    race, setRace, 
    dndClass, setDndClass, 
    stats, setStats, 
    keywords, setKeywords, 
    gameMode, setGameMode 
  } = useGameStore();

  React.useEffect(() => {
    setStats(calculateBaseStats(dndClass, race));
  }, [dndClass, race, setStats]);
`;

code = code.replace(/  const \{[^\}]+} = useGameStore\(\);/s, effectCode);

// Add +X display logic for stats mapping
const statsMapRegex = /<div key=\{stat\}.*?<\/div>/s;
code = code.replace(
  /{Object\.entries\(stats\)\.map\(\(\[stat, val\]\) => \([\s\S]*?\)\)}/g,
  `{Object.entries(stats).map(([stat, val]) => {
                      const bonus = RACES[race]?.bonuses?.[stat as keyof typeof RACES[string]['bonuses']];
                      return (
                      <div key={stat} className="bg-[#f9f6e6] p-2 rounded-lg border border-amber-900/15 shadow-sm relative">
                        <div className="text-[10px] uppercase text-amber-900 font-bold tracking-wider mb-0.5">{stat}</div>
                        <div className="text-lg sm:text-xl font-cinzel font-bold text-slate-900">
                          {val as number}
                          {bonus ? <span className="text-green-600 text-sm ml-1">(+{bonus})</span> : null}
                        </div>
                      </div>
                      )
                    })}`
);


fs.writeFileSync(path, code);
console.log("Patched!");

