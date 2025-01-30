import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { useTranslation } from 'react-i18next';
import { Suspense, lazy } from 'react';

const UserViewLazy = lazy(() => import('../sections/user/view/userView'));

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${t('users')} - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content={`${t('users')} - ${CONFIG.appName}`}
        />
        <meta
          property="og:title"
          content={`${t('users')} - ${CONFIG.appName}`}
        />
      </Helmet>

      <Suspense>
        <UserViewLazy />
      </Suspense>
    </>
  );
}
