import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { useTranslation } from 'react-i18next';
import { Suspense, lazy } from 'react';

const SharedspaceViewLazy = lazy(
  () => import('../sections/sharedspace/sharedspaceView')
);

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${t('sharedspaces')} - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content={`${t('sharedspaces')} - ${CONFIG.appName}`}
        />
        <meta
          property="og:title"
          content={`${t('sharedspaces')} - ${CONFIG.appName}`}
        />
      </Helmet>

      <Suspense>
        <SharedspaceViewLazy />
      </Suspense>
    </>
  );
}
