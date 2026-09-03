import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()
for i, l in enumerate(lines):
    if '<audio ref={bgAudioRef}' in l:
        lines[i] = l.replace('<audio ref={bgAudioRef}', '<audio id="bg-audio" ref={bgAudioRef}')

with codecs.open('src/app/page.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
