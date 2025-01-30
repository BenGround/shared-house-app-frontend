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
