import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  CardActions,
  Box,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSharedSpaces } from 'src/contexts/shareSpacesContext';
import { formatHour, getHoursDifference } from 'src/utils/dateTimeUtils';

interface BookingCardProps {
  booking: any;
  deleteBooking: (id: number) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  deleteBooking,
}) => {
  const { t, i18n } = useTranslation();
  const { sharedSpaces } = useSharedSpaces();

  const isEn = i18n.language === 'en';
  const language = isEn ? 'en-US' : 'ja-JP';
  const sharedSpace = sharedSpaces.find((s) => s.id === booking.sharedSpaceId);
  const bookingDuration = getHoursDifference(
    new Date(booking.startDate),
    new Date(booking.endDate)
  );
  const sharedSpaceName = isEn ? sharedSpace?.nameEn : sharedSpace?.nameJp;

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (sharedSpace?.picture) {
    const img = new Image();
    img.src = sharedSpace?.picture;

    img.onload = () => setIsImageLoaded(true);
    img.onerror = () => setIsImageLoaded(false);
  }

  const isRightNow =
    new Date(booking.startDate).getTime() <= Date.now() &&
    new Date(booking.endDate).getTime() >= Date.now();
  return (
    <Card
      key={booking.id}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: 6,
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: 200,
          backgroundImage: isImageLoaded
            ? `url(${sharedSpace?.picture})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#f5f5f5',
          position: 'relative',
        }}
      >
        {!isImageLoaded && (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="h5"
              color="white"
              sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}
            >
              {sharedSpaceName}
            </Typography>
          </Box>
        )}

        {isRightNow && (
          <Chip
            label={t('booking.rightNow')}
            color="success"
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              fontWeight: 'bold',
            }}
          />
        )}

        <Chip
          label={t('booking.booked')}
          color="primary"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            fontWeight: 'bold',
            backgroundColor: 'rgba(115, 102, 102, 0.8)',
          }}
        />
      </Box>

      <CardContent sx={{ padding: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            marginBottom: 2,
            color: 'primary.main',
          }}
        >
          {sharedSpaceName}
        </Typography>

        <Typography variant="body1" color="textSecondary" gutterBottom>
          {t('booking.date')}:{' '}
          {new Date(booking.startDate).toLocaleString(language, {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {t('booking.duration')}: {formatHour(bookingDuration)}
        </Typography>
      </CardContent>

      <CardActions sx={{ padding: 3, paddingTop: 0 }}>
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={() => deleteBooking(booking.id)}
          sx={{
            fontWeight: 'bold',
            padding: 1.5,
            '&:hover': {
              backgroundColor: 'error.dark',
            },
          }}
        >
          {t('button.cancel')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default BookingCard;
