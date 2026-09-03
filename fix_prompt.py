import codecs

lines = codecs.open('ai-rpg-backend/main.py', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if '1K: Upadajc Impcrium (Zkorumpovan lechta)' in l:
        lines[i] = '  1K (Valerijské Impérium): Upadající Impérium (Zkorumpovaná šlechta)\n'
    elif '2K: Teokracie (Nboent fanatici ?du)' in l:
        lines[i] = '  2K (Svatá říše Solariova): Teokracie (Náboženští fanatici Řádu)\n'
    elif '3K: Divokc Kmeny (Pteiv v bainch/lesch, krevn rituly)' in l:
        lines[i] = '  3K (Kmeny z Hlubokých hvozdů): Divoké Kmeny (Přeživší v bažinách/lesích, krevní rituály)\n'
    elif '4K: Obchodn Gildy (oldci a penze, dn krl)' in l:
        lines[i] = '  4K (Svobodná města): Obchodní Gildy (Žoldáci a peníze, žádný král)\n'
    elif '5K: Karantcnn Zƈna (Magick pustina, monstra)' in l:
        lines[i] = '  5K (Karanténní Zóna): Magická pustina, zamořená monstry\n'
    elif '6K: Severn Hradba (Militarizovan str pted zlem)' in l:
        lines[i] = '  6K (Železný Práh): Severní Hradba (Militarizovaná stráž před zlem)\n'
    elif '7K: toit> Vyvolench (Tajemn mgovc a izolace)' in l:
        lines[i] = '  7K (Tajemné Útočiště): Izolované útočiště Vyvolených (Mágové)\n'
        
    # Also instruct the AI not to use "Království X" literally
    if 'Tady je JSON se vemi body zjmu' in l:
        lines.insert(i, '  DŮLEŽITÉ: Ve výstupech nikdy nepoužívej generické názvy jako "Království 6". Vždy použij názvy výše (např. Železný Práh).\n\n')

with codecs.open('ai-rpg-backend/main.py', 'w', 'utf-8') as f:
    f.write("".join(lines))
