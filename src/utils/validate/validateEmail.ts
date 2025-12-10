const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.trim());
};

export const extractEmailDomain = (email: string): string | null => {
  if (!validateEmail(email)) return null;
  return email.split('@')[1];
};
