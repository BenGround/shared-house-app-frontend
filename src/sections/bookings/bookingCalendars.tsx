import React, { Suspense, useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardContent } from 'src/layouts/dashboard';
import { useShareSpaces } from 'src/contexts/shareSpacesContext';

const BookingCalendar = React.lazy(() => import('./bookingCalendar'));

type BookingCalendarsProps = {
  sharedSpaceNameCode: string | undefined;
};

const BookingCalendars: React.FC<BookingCalendarsProps> = ({
  sharedSpaceNameCode,
}) => {
  const { t } = useTranslation();
  const { sharedSpaces, error } = useShareSpaces();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  if (error) {
    return <div>{error}</div>;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (loading) return;

    const selectedSpace = sharedSpaces[newValue];
    if (selectedSpace) {
      setLoading(true);
      navigate(`/bookings/${selectedSpace.nameCode}`);
    }
  };

  const currentIndex = sharedSpaces.findIndex(
    (space) => space.nameCode === sharedSpaceNameCode
  );
  const shareSpace =
    sharedSpaces.find((space) => space.nameCode === sharedSpaceNameCode) ||
    sharedSpaces[0];

  return (
    <DashboardContent>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentIndex >= 0 ? currentIndex : 0}
            onChange={handleTabChange}
            aria-label="shared space booking tabs"
          >
            {sharedSpaces.map((space) => (
              <Tab
                key={space.id}
                label={t(space.nameCode)}
                sx={{
                  textTransform: 'capitalize',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ paddingTop: 1 }}>
          {shareSpace ? (
            <Suspense>
              <BookingCalendar
                sharedSpace={shareSpace}
                isFetching={(fetching) => {
                  setLoading(fetching);
                }}
              />
            </Suspense>
          ) : (
            <Typography variant="h5">
              {t('bookings.selectSharedSpace')}
            </Typography>
          )}
        </Box>
      </Box>
    </DashboardContent>
  );
};

export default BookingCalendars;
