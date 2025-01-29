import { CONFIG } from '../config-global';
import { useTranslation } from 'react-i18next';
import { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';

const Main = lazy(() => import('../sections/home/main'));

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${t('home')} - ${CONFIG.appName}`}</title>
        <meta name="description" content={`${t('home')} - ${CONFIG.appName}`} />
        <meta
          property="og:title"
          content={`${t('home')} - ${CONFIG.appName}`}
        />
      </Helmet>

      <Suspense>
        <Main />
      </Suspense>
    </>
  );
}
