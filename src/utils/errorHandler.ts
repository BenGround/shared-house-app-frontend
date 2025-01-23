import { toast } from 'react-toastify';
import i18n from 'i18next';

export const handleError = (error: any) => {
  const errorMessage = i18n.t(`errors.${error.response.data.errorCode}`);
  toast.error(errorMessage);

  return errorMessage;
};
