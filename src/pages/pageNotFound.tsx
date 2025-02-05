import { Helmet } from 'react-helmet-async';
import { NotFoundView } from '../sections/error';
import { CONFIG } from 'src/config-global';
import { useTranslation } from 'react-i18next';
import { Suspense, lazy } from 'react';

const NotFoundViewLazy = lazy(() => import('../sections/error/not-found-view'));

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${t('pagenotfound')} - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content={`${t('pagenotfound')} - ${CONFIG.appName}`}
        />
        <meta
          property="og:title"
          content={`${t('pagenotfound')} - ${CONFIG.appName}`}
        />
      </Helmet>

      <Suspense>
        <NotFoundViewLazy />
      </Suspense>
    </>
  );
}
