import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { useTranslation } from 'react-i18next';
import { Suspense, lazy } from 'react';

const ProfileLazy = lazy(() => import('../sections/profile/profile'));

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${t('profile')} - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content={`${t('profile')} - ${CONFIG.appName}`}
        />
        <meta
          property="og:title"
          content={`${t('profile')} - ${CONFIG.appName}`}
        />
      </Helmet>

      <Suspense>
        <ProfileLazy />
      </Suspense>
    </>
  );
}
