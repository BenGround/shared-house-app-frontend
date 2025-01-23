import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { useTranslation } from 'react-i18next';
import BookingCalendars from 'src/sections/bookings/bookingCalendars';
import { useParams } from 'react-router-dom';

export default function Page() {
  const { t } = useTranslation();
  const { sharedSpaceNameCode } = useParams<{
    sharedSpaceNameCode: string;
  }>();

  return (
    <>
      <Helmet>
        <title> {`${t('reservation')} - ${CONFIG.appName}`}</title>
      </Helmet>

      <BookingCalendars sharedSpaceNameCode={sharedSpaceNameCode} />
    </>
  );
}
