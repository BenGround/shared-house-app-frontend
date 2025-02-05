import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardContent } from 'src/layouts/dashboard';
import { useSharedSpaces } from 'src/contexts/shareSpacesContext';
import 'src/css/transition.css';
import axiosInstance from 'src/settings/axiosInstance';
import { handleError } from 'src/utils/errorHandler';
import LoadingSpinner from 'src/components/loadingSpinner/loadingSpinner';
import BookingCard from 'src/components/bookingCard/bookingCard';

const BookingCalendars: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { error } = useSharedSpaces();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    axiosInstance
      .get('bookings/user', { withCredentials: true })
      .then((response) => setBookings(response.data.data))
      .catch((error) => handleError(error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleCancelBooking = (bookingId: number) => {
    const confirmed = window.confirm(t('bookings.confirmDelete'));
    if (!confirmed) return;

    axiosInstance
      .delete(`bookings/${bookingId}`, { withCredentials: true })
      .then(() => setBookings((prev) => prev.filter((b) => b.id !== bookingId)))
      .catch((error) => handleError(error));
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <DashboardContent>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
          flexDirection="column"
        >
          <LoadingSpinner translationKey="recovering.bookings" />
          <Typography mt={2}>{t('loading')}</Typography>
        </Box>
      ) : (
        <Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mb={4}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {t('my.bookings')}
            </Typography>
          </Box>
          {bookings.length > 0 ? (
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
              gap={2}
            >
              {bookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  deleteBooking={(id) => handleCancelBooking(id)}
                />
              ))}
            </Box>
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="60vh"
              flexDirection="column"
            >
              <Typography variant="h6" color="textSecondary" mb={2}>
                {t('not.bookings.yet')}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/bookings')}
                sx={{
                  fontWeight: 'bold',
                  padding: '8px 16px',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                {t('go.to.bookings')}
              </Button>
            </Box>
          )}
        </Box>
      )}
    </DashboardContent>
  );
};

export default BookingCalendars;
