export const firstError = (errors) => errors.filter(Boolean)[0];

// Helper function to ensure all required fields are filled
export const validateRequiredField = (fieldValue, msg) => {
  const value = fieldValue.trim();
  return !value ? msg : "";
};

export const validateLength = (fieldValue, minChar, msg) => {
  const value = fieldValue.replace(/\s+/g, "");

  return value.length < minChar ? msg : "";
};

export function validateMobile(fieldValue, msg = "شماره موبایل معتبر نیست") {
  const pattern = /^(09)[0-9]{9}$/;
  return !fieldValue || !pattern.test(fieldValue) ? msg : "";
}

export function validatePhone(fieldValue, msg = "شماره تلفن معتبر نیست") {
  const pattern = /^0\d{10}$/;
  return !fieldValue || !pattern.test(fieldValue) ? msg : "";
}

export function validateGender(fieldValue, msg = "جنسیت را انتخاب کنید") {
  return !fieldValue ? msg : "";
}

export function validateAccountType(
  fieldValue,
  msg = "نوع حساب کاربری را انتخاب کنید"
) {
  return !fieldValue ? msg : "";
}
