const str1 = "Úspěch.";
const str2 = " Neúspěch.";
const str3 = ">Úspěch.<";
const reg = /(?<!\p{L})(Úspěch\.|Úspěch!|Úspěch:?)/giu;
console.log(str1.replace(reg, "X"));
console.log(str2.replace(reg, "X"));
console.log(str3.replace(reg, "X"));
