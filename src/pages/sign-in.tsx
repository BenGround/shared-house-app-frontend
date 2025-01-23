import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { SignInView } from '../sections/auth';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title> {`${t('signin')} - ${CONFIG.appName}`}</title>
      </Helmet>

      <SignInView />
    </>
  );
}
