import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    new_lines.append(line)
    if "const [pointsOfInterest, setPointsOfInterest] = useState" in line:
        new_lines.append('  const [currentImage, setCurrentImage] = useState<string | null>(null);\n')
        new_lines.append('  const [currentImageError, setCurrentImageError] = useState<string | null>(null);\n')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.writelines(new_lines)
print("States fixed!")
