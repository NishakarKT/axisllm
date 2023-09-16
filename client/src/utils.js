export const getRandomColor = (opacity) => {
  const r = Math.floor((Math.random() * 255) / 2);
  const g = Math.floor((Math.random() * 255) / 2);
  const b = Math.floor((Math.random() * 255) / 2);
  return `rgba(${r},${g},${b},${opacity || 1})`;
};

export const getNumericIfPossible = (str) => {
  if (typeof str != "string") return str;
  return !isNaN(str) && !isNaN(parseFloat(str)) ? parseFloat(str) : str;
};

export const dataFormatter = (number) => {
  if (number > 1e9) {
    return Math.floor(number / 1e9).toString() + "B";
  } else if (number > 1e6) {
    return Math.floor(number / 1e6).toString() + "M";
  } else if (number > 1e3) {
    return Math.floor(number / 1e3).toString() + "K";
  } else {
    return number.toString();
  }
};

export const getDateFormat = (dateString) => {
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4);
  const date = new Date(year, month - 1);
  return !isNaN(date) ? date.toLocaleString("default", { month: "short", year: "numeric" }) : dateString;
};

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
