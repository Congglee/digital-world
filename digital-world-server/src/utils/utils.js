const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generateOrderCode = () => {
  const randomNumber = generateRandomNumber(100000, 999999);
  const randomLetter = String.fromCharCode(generateRandomNumber(65, 90));
  return `#${randomNumber}${randomLetter}DW2`;
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
