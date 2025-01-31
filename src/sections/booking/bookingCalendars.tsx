import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardContent } from 'src/layouts/dashboard';
import { useShareSpaces } from 'src/contexts/shareSpacesContext';
import { CSSTransition } from 'react-transition-group';
import 'src/css/transition.css';

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
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

  const ref = useRef(null);

  useEffect(() => {
    if (sharedSpaceNameCode) {
      const initialTabIndex = sharedSpaces.findIndex(
        (space) => space.nameCode === sharedSpaceNameCode
      );
      setSelectedTabIndex(initialTabIndex >= 0 ? initialTabIndex : 0);
    }
  }, [sharedSpaceNameCode, sharedSpaces]);

  if (error) {
    return <div>{error}</div>;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (loading) return;

    setSelectedTabIndex(newValue);
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
            value={selectedTabIndex >= 0 ? selectedTabIndex : 0}
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
          <CSSTransition
            nodeRef={ref}
            in={selectedTabIndex === currentIndex}
            timeout={500}
            classNames="fade"
            unmountOnExit
          >
            <div ref={ref}>
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
            </div>
          </CSSTransition>
        </Box>
      </Box>
    </DashboardContent>
  );
};

export default BookingCalendars;
