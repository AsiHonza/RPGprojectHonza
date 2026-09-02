import codecs

lines = codecs.open('src/app/page.tsx', 'r', 'utf-8').readlines()

typewriter_start = -1
typewriter_end = -1
syslog_start = -1
syslog_end = -1

for i, l in enumerate(lines):
    if "const TypewriterText" in l:
        typewriter_start = i
    if "const FormattedSystemLog" in l:
        syslog_start = i
        typewriter_end = i - 2
    if syslog_start != -1 and "export default function Home()" in l:
        syslog_end = i - 1
        break

typewriter_comp = "import React, { useState, useEffect } from 'react';\n" + "".join(lines[typewriter_start:typewriter_end]).replace("const TypewriterText =", "export const TypewriterText =")
syslog_comp = "import React from 'react';\n" + "".join(lines[syslog_start:syslog_end]).replace("const FormattedSystemLog =", "export const FormattedSystemLog =")

with codecs.open('src/components/ui/TypewriterText.tsx', 'w', 'utf-8') as f:
    f.write(typewriter_comp)

with codecs.open('src/components/ui/FormattedSystemLog.tsx', 'w', 'utf-8') as f:
    f.write(syslog_comp)

print("Helpers extracted")
