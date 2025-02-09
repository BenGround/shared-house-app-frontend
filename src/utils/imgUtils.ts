import i18n from 'i18next';

export const NAV_LOGO = 'https://i.imgur.com/j7YMG5P.png';
export const JAPAN_FLAG =
  'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flag_of_Japan.svg';
export const ENGLISH_FLAG =
  'https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg';
export const DASHBOARD_IMG = 'https://i.imgur.com/wmFWM7L.jpeg';

const MAX_FILE_SIZE_MB = 2;

export const validateFile = (file: File): string | undefined => {
  const fileSizeInMB = file.size / 1024 / 1024;
  if (!file.type.startsWith('image/')) {
    return i18n.t('file.invalid.format');
  }
  if (fileSizeInMB > MAX_FILE_SIZE_MB) {
    return i18n.t('file.size.exceeds', { size: MAX_FILE_SIZE_MB });
  }
  return undefined;
};
