import { t } from 'i18next';

export type PasswordRule = {
  label: string;
  test: (pwd: string) => boolean;
};

export const passwordRules: PasswordRule[] = [
  {
    label: t('password.validation.eight.characters'),
    test: (pwd: string) => pwd.length >= 8,
  },
  {
    label: t('password.validation.uppercase.letter'),
    test: (pwd: string) => /[A-Z]/.test(pwd),
  },
  {
    label: t('password.validation.lowercase.letter'),
    test: (pwd: string) => /[a-z]/.test(pwd),
  },
  {
    label: t('password.validation.one.number'),
    test: (pwd: string) => /[0-9]/.test(pwd),
  },
  {
    label: t('password.validation.one.special'),
    test: (pwd: string) => /[\W_]/.test(pwd),
  },
];

export const validatePassword = (password: string) => {
  return passwordRules.map((rule) => rule.test(password));
};

export const validateUsername = (username: string): boolean => {
  const usernameRegex =
    /^[a-zA-Z0-9\s_\u3040-\u30FF\u4E00-\u9FFF\u00C0-\u00FF]{3,25}$/;
  return usernameRegex.test(username);
};
