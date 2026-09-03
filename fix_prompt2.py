import codecs

lines = codecs.open('ai-rpg-backend/main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '1K:' in l and 'Imp' in l:
        lines[i] = '  1K (Valerijské Impérium): Upadající Impérium (Zkorumpovaná šlechta)\n'
    elif '2K:' in l and 'Teokrac' in l:
        lines[i] = '  2K (Svatá říše Solariova): Teokracie (Náboženští fanatici Řádu)\n'
    elif '3K:' in l and 'Kmeny' in l:
        lines[i] = '  3K (Kmeny z Hlubokých hvozdů): Divoké Kmeny (Přeživší v bažinách/lesích, krevní rituály)\n'
    elif '4K:' in l and 'Gildy' in l:
        lines[i] = '  4K (Svobodná města): Obchodní Gildy (Žoldáci a peníze, žádný král)\n'
    elif '5K:' in l and 'Karant' in l:
        lines[i] = '  5K (Karanténní Zóna): Magická pustina, zamořená monstry\n'
    elif '6K:' in l and 'Hradba' in l:
        lines[i] = '  6K (Železný Práh): Severní Hradba (Militarizovaná stráž před zlem)\n'
    elif '7K:' in l and 'Vyvolen' in l:
        lines[i] = '  7K (Tajemné Útočiště): Izolované útočiště Vyvolených (Mágové)\n\n  DŮLEŽITÉ: Ve výstupech (názvech lokací ani popisech) NIKDY nepoužívej generické názvy jako "Království 6". Místo toho vždy použij název dané frakce/území z tohoto seznamu (např. Železný Práh).\n'

with codecs.open('ai-rpg-backend/main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
