import codecs

lines = codecs.open('src/components/map/HexMap.tsx', 'r', 'utf-8').readlines()

for i, l in enumerate(lines):
    if 'setTransform(-px * scale + ' in l:
        lines[i] = '                    const wrapper = document.querySelector(".react-transform-wrapper");\n'
        lines.insert(i+1, '                    const cx = wrapper ? wrapper.clientWidth / 2 : 400;\n')
        lines.insert(i+2, '                    const cy = wrapper ? wrapper.clientHeight / 2 : 400;\n')
        lines.insert(i+3, '                    setTransform(-px * scale + cx, -py * scale + cy, scale, 500);\n')
        break

with codecs.open('src/components/map/HexMap.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
