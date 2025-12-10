const PHONE_REGEX = /^01[016789]\d{7,8}$/;

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[^0-9]/g, '');
  return PHONE_REGEX.test(cleaned);
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/[^0-9]/g, '');

  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};
