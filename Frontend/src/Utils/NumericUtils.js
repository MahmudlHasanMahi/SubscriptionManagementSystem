import i18n from "./i18n";
const isEnglishNumber = (value) => /^-?\d+(\.\d+)?$/.test(value);

const isArabicNumber = (str) => /^-?[٠-٩]+([٫\.][٠-٩]+)?$/.test(str);

const arabicToEnglish = (numStr = "") => {
  return numStr
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)) // digits
    .replace(/٫/g, "."); // Arabic decimal to normal dot
};

function englishToArabic(num) {
  const eng = "0123456789.";
  const arab = "٠١٢٣٤٥٦٧٨٩٫";
  return String(num).replace(/[0-9.]/g, (ch) => arab[eng.indexOf(ch)]);
}

const isValidNumber = (str) => {
  if (isEnglishNumber(str)) return true;

  return i18n.language === "ar" ? isArabicNumber(str) : isEnglishNumber(str);
};
const ArabicFormatter = new Intl.NumberFormat("ar-SA", {
  numberingSystem: "latn",
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const EnglishFormatter = new Intl.NumberFormat("en-US", {
  numberingSystem: "latn",
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const Number = (str, formatted = false, translate = false) => {
  let number = str;
  if (translate && i18n.language === "ar") {
    return isArabicNumber(str) ? arabicToEnglish(str) : englishToArabic(str);
}
  if (i18n.language === "ar") {
    number = arabicToEnglish(str.toString());
    return formatted ? ArabicFormatter.format(number) : parseFloat(number);
  } else {
    return formatted ? EnglishFormatter.format(str) : parseFloat(str);
  }
};

export { isValidNumber, Number, englishToArabic };
