import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';

const SignInView = lazy(() => import('../sections/auth/sign-in-view'));

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${t('signin')} - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content={`${t('signin')} - ${CONFIG.appName}`}
        />
        <meta
          property="og:title"
          content={`${t('signin')} - ${CONFIG.appName}`}
        />
      </Helmet>

      <Suspense>
        <SignInView />
      </Suspense>
    </>
  );
}
