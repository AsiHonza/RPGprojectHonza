import codecs

with codecs.open('main.py', 'r', 'utf-8') as f:
    lines = f.readlines()

new_lines = lines[:151] + lines[357:]

with codecs.open('main.py', 'w', 'utf-8') as f:
    f.writelines(new_lines)
print('Fixed!')
