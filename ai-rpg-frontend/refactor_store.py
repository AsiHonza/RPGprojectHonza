import codecs
import re

lines = codecs.open('src/store/gameStore.ts', 'r', 'utf-8').readlines()

new_lines = []
for l in lines:
    # Match interface definitions: setHp: (hp: number) => void;
    match_iface = re.search(r'set([A-Z]\w*):\s*\(\s*[a-z]+\s*:\s*([^)]+)\)\s*=>\s*void;', l)
    if match_iface:
        prop = match_iface.group(1)
        type_str = match_iface.group(2)
        # Change to setHp: (hp: type | ((prev: type) => type)) => void;
        new_lines.append(f"  set{prop}: (val: {type_str} | ((prev: {type_str}) => {type_str})) => void;\n")
        continue
        
    # Match implementation: setHp: (hp) => set({ hp }),
    match_impl = re.search(r'set([A-Z]\w*):\s*\(([a-zA-Z0-9_]+)\)\s*=>\s*set\(\{.*?\}\),', l)
    if match_impl:
        prop = match_impl.group(1)
        var_name = match_impl.group(2)
        state_prop = prop[0].lower() + prop[1:]
        new_lines.append(f"  set{prop}: (val) => set((state) => ({{ {state_prop}: typeof val === 'function' ? (val as any)(state.{state_prop}) : val }})),\n")
        continue

    new_lines.append(l)

with codecs.open('src/store/gameStore.ts', 'w', 'utf-8') as f:
    f.write("".join(new_lines))
    
print("Store updated with functional setters")
