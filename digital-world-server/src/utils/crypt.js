import crypto from "crypto";

export const hashValue = (value) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

export const compareValue = (plainText, hash) => {
  return hashValue(plainText) === hash;
};

export const generatePasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const passwordResetToken = hashValue(resetToken);
  const passwordResetExpires = Date.now() + 15 * 60 * 1000;

  return {
    resetToken,
    passwordResetToken,
    passwordResetExpires,
  };
};
