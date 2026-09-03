import codecs
import os
import glob

files = glob.glob('src/**/*.tsx', recursive=True)
for filepath in files:
    with codecs.open(filepath, 'r', 'utf-8') as f:
        content = f.read()
    
    original = content
    content = content.replace('text-[#e5e7eb]', 'text-slate-900')
    content = content.replace('placeholder-white/20', 'placeholder-slate-400')
    
    if content != original:
        with codecs.open(filepath, 'w', 'utf-8') as f:
            f.write(content)
        print("Fixed", filepath)
