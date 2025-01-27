import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { Profile } from '../sections/profile';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title> {`${t('profile')} - ${CONFIG.appName}`}</title>
      </Helmet>

      <Profile />
    </>
  );
}
