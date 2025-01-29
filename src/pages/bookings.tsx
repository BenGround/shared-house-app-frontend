import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { useTranslation } from 'react-i18next';
import { Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom';

const BookingCalendars = lazy(
  () => import('src/sections/bookings/bookingCalendars')
);

export default function Page() {
  const { t } = useTranslation();
  const { sharedSpaceNameCode } = useParams<{ sharedSpaceNameCode: string }>();

  return (
    <>
      <Helmet>
        <title>{`${t('reservation')} - ${CONFIG.appName}`}</title>
        <meta
          name="description"
          content={`${t('reservation')} - ${CONFIG.appName}`}
        />
        <meta
          property="og:title"
          content={`${t('reservation')} - ${CONFIG.appName}`}
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
