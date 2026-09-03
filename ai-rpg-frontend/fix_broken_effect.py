import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

start_idx = -1
end_idx = -1

for i, l in enumerate(lines):
    if 'const TypewriterText = ' in l:
        # Search for the bad useEffect inside TypewriterText
        for j in range(i, i+20):
            if 'useEffect(() => {' in lines[j] and 'playAudio' in lines[j+1]:
                start_idx = j
                for k in range(j, j+15):
                    if '  }, [musicPlaying]);' in lines[k]:
                        end_idx = k
                        break
                break
        break

if start_idx != -1 and end_idx != -1:
    for i in range(start_idx, end_idx + 1):
        lines[i] = ''

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
