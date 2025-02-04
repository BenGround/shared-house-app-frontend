import { toast } from 'react-toastify';
import i18n from 'i18next';

export const handleError = (error: any) => {
  const translateKey = error.response
    ? error.response.data.errorCode
    : error.message;

  const errorMessage = i18n.exists(`errors.${translateKey}`)
    ? i18n.t(`errors.${translateKey}`)
    : i18n.t('errors.occured');
  toast.error(errorMessage);

  return errorMessage;
};
