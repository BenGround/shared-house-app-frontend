import React from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import BookingCalendar from './bookingCalendar';
import { useTranslation } from 'react-i18next';
import { DashboardContent } from 'src/layouts/dashboard';
import { useShareSpaces } from 'src/contexts/shareSpacesContext';

type BookingCalendarsProps = {
  sharedSpaceNameCode: string | undefined;
};

const BookingCalendars: React.FC<BookingCalendarsProps> = ({
  sharedSpaceNameCode,
}) => {
  const { t } = useTranslation();
  const { sharedSpaces, error } = useShareSpaces();
  const navigate = useNavigate();

  if (error) {
    return <div>{error}</div>;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const selectedSpace = sharedSpaces[newValue];
    if (selectedSpace) {
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
    <DashboardContent maxWidth="xl">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentIndex >= 0 ? currentIndex : 0}
            onChange={handleTabChange}
            aria-label="shared space booking tabs"
          >
            {sharedSpaces.map((space, index) => (
              <Tab
                key={space.id}
                label={t(space.nameCode)}
                sx={{
                  textTransform: 'capitalize',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
                }}
                component={Link}
                to={`/bookings/${space.nameCode}`}
              />
            ))}
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {shareSpace ? (
            <BookingCalendar sharedSpace={shareSpace} />
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
