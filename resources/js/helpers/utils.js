export const moneyFormat = (number = 0, locale = 'en-PH', currency = 'PHP') => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(number);
};

export const getPercentage = (number, percent) => {
  return (percent / 100) * number;
};

export const camelCase = string => string.charAt(0).toUpperCase() + string.slice(1);

export const titleCasePath = path => path.replace('/', '').replace('#', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export const formatTime = timeString => {
  if (!timeString) return null;

  const [hourString, minute] = timeString.split(":");
  const hour = +hourString % 24;
  return (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
}

export const generateHourArray = () => {
  const hours = [];
  for (let hour = 1; hour <= 23; hour++) {
    hours.push(`${hour}:00:00`);
  }
  return hours;
};

export const generateRandomCode = () => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
};

export const maskNumber = (number, visibleDigits = 4, maskChar = '*') => {
  // Convert the number to a string
  let numberStr = number.toString();
  
  // Calculate the number of characters to mask
  let numCharsToMask = numberStr.length - 4;
  
  // Replace characters except the last four with asterisks
  let maskedNumber = '*'.repeat(numCharsToMask) + numberStr.substring(numCharsToMask);
  
  return maskedNumber;
}