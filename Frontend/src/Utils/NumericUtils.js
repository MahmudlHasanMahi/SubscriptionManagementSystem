import { getLanguage } from "./ChangeLanguage";
const isEnglishNumber = (value) => /^-?\d+(\.\d+)?$/.test(value);

const isArabicNumber = (str) => /^-?[٠-٩]+([٫\.][٠-٩]+)?$/.test(str);

const arabicToEnglish = (numStr = "") => {
  return numStr
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)) // digits
    .replace(/٫/g, "."); // Arabic decimal to normal dot
};

const isValidNumber = (str) => {
  return getLanguage() === "ar" ? isArabicNumber(str) : isEnglishNumber(str);
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

const Number = (str, formatted = false) => {
  let number = str;
  if (getLanguage() === "ar") {
    number = arabicToEnglish(str.toString());
    return formatted ? ArabicFormatter.format(number) : number;
  } else {
    return formatted ? EnglishFormatter.format(str) : str;
  }
};

export { isValidNumber, Number };
