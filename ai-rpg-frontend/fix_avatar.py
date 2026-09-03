import codecs

lines = codecs.open('src/features/ui/PlayerHeader.tsx', 'r', 'utf-8').readlines()

# add useState
for i, l in enumerate(lines):
    if 'import { useState } from' in l:
        break
    if 'import React' in l or 'from "react"' in l:
        lines[i] = 'import React, { useState } from "react";\n'
        break
    if 'import { ' in l and 'lucide-react' in l:
        lines.insert(i, 'import { useState } from "react";\n')
        break

# find the component start to add the helper and state
for i, l in enumerate(lines):
    if 'const { ' in l and 'name, level, race' in lines[i+1]:
        lines.insert(i, '  const [avatarError, setAvatarError] = useState(false);\n')
        lines.insert(i, '''
  const getAvatarVideo = (r: string) => {
    if (!r) return null;
    const lower = r.toLowerCase();
    if (lower.includes('člověk') || lower.includes('clovek')) return '/video/avatars/clovek.mp4';
    if (lower.includes('elf')) return '/video/avatars/elf.mp4';
    if (lower.includes('trpasl')) return '/video/avatars/trpaslik.mp4';
    if (lower.includes('půlč') || lower.includes('pulc')) return '/video/avatars/pulcik.mp4';
    if (lower.includes('drak')) return '/video/avatars/drakorozeny.mp4';
    if (lower.includes('tiefling')) return '/video/avatars/tiefling.mp4';
    if (lower.includes('ork') || lower.includes('orc')) return '/video/avatars/pulork.mp4';
    if (lower.includes('gnóm') || lower.includes('gnom')) return '/video/avatars/gnom.mp4';
    return null;
  };
''')
        break

# replace the User icon with the video/icon logic
for i, l in enumerate(lines):
    if '<User size={28} />' in l:
        lines[i] = '''
            {getAvatarVideo(race) && !avatarError ? (
              <video 
                src={getAvatarVideo(race)!} 
                autoPlay loop muted playsInline 
                className="w-full h-full object-cover rounded-full"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <User size={28} />
            )}
'''
        break

with codecs.open('src/features/ui/PlayerHeader.tsx', 'w', 'utf-8') as f:
    f.write("".join(lines))
