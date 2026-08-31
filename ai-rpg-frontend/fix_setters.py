import codecs

with codecs.open("src/app/page.tsx", "r", "utf-8") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    new_lines.append(line)
    if "setPointsOfInterest(state.pointsOfInterest)" in line:
        new_lines.append('        if (state.currentImage) setCurrentImage(state.currentImage);\n')
        new_lines.append('        if (state.currentImageError) setCurrentImageError(state.currentImageError);\n')
        
    if "setPointsOfInterest(data.vyznamna_mista)" in line:
        new_lines.append('        if (data.image_url) setCurrentImage(data.image_url);\n')
        new_lines.append('        else if (data.image_base64) setCurrentImage(data.image_base64);\n')
        new_lines.append('        if (data.image_error) setCurrentImageError(data.image_error);\n')
        new_lines.append('        else if (data.image_url || data.image_base64) setCurrentImageError(null);\n')

with codecs.open("src/app/page.tsx", "w", "utf-8") as f:
    f.writelines(new_lines)
print("Setters fixed!")
