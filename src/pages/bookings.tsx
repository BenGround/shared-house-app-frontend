import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { useTranslation } from 'react-i18next';
import { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';

const BookingCalendars = lazy(
  () => import('src/sections/booking/bookingCalendars')
);

export default function Page() {
  const { t } = useTranslation();
  const { sharedSpaceNameCode } = useParams<{ sharedSpaceNameCode: string }>();

  return (
    <>
      <Helmet>
        <title>{`${t('bookings.sharedspaces')} - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content={`${t('bookings.sharedspaces')} - ${CONFIG.appName}`}
        />
        <meta
          property="og:title"
          content={`${t('bookings.sharedspaces')} - ${CONFIG.appName}`}
        />
      </Helmet>

      <Suspense>
        {sharedSpaceNameCode ? (
          <BookingCalendars sharedSpaceNameCode={sharedSpaceNameCode} />
        ) : (
          <div>{t('error.invalidSpace')}</div>
        )}
      </Suspense>
    </>
  );
}
