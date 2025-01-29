import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { useTranslation } from 'react-i18next';
import { Suspense, lazy } from 'react';

const CreatePassword = lazy(
  () => import('../sections/createPassword/create-password')
);

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${t('create-password')} - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content={`${t('create-password')} - ${CONFIG.appName}`}
        />
        <meta
          property="og:title"
          content={`${t('create-password')} - ${CONFIG.appName}`}
        />
      </Helmet>

      <Suspense>
        <CreatePassword />
      </Suspense>
    </>
  );
}
