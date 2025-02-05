import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { useTranslation } from 'react-i18next';
import { Suspense, lazy } from 'react';

const MyBookings = lazy(() => import('src/sections/booking/myBookings'));

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${t('my.bookings')} - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content={`${t('my.bookings')} - ${CONFIG.appName}`}
        />
        <meta
          property="og:title"
          content={`${t('my.bookings')} - ${CONFIG.appName}`}
        />
      </Helmet>

      <Suspense>
        <MyBookings />
      </Suspense>
    </>
  );
}
