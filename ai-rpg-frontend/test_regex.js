const str1 = "Úspìch.";
const str2 = " Neúspìch.";
const reg = /\b(Úspìch\.|Úspìch!|Úspìch:?)\b/gi;
console.log(str1.replace(reg, "X"));
console.log(str2.replace(reg, "X"));
