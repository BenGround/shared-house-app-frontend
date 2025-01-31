import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SharedSpace } from 'src/types/sharedSpace';
import { AccessTime } from '@mui/icons-material';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import BookingSwiper from './bookingSwiper';

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  sharedSpace: SharedSpace;
  startDate: DayPilot.Date;
  bookingTimeHours: number;
  onCreateBooking: (startDate: Date, hours: number) => void;
};

const BookingCreateDialog: React.FC<BookingModalProps> = ({
  open,
  onClose,
  sharedSpace,
  startDate,
  bookingTimeHours,
  onCreateBooking,
}) => {
  const { i18n, t } = useTranslation();
  const language = i18n.language === 'en' ? 'en-US' : 'ja-JP';
  const [hours, setHours] = useState<number>(bookingTimeHours);

  useEffect(() => {
    setHours(bookingTimeHours);
  }, [bookingTimeHours]);

  const startDateTS = new Date(startDate.toString());

  const formattedDate = new Intl.DateTimeFormat(language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(startDateTS);

  const handleCreate = () => {
    onCreateBooking(startDateTS, hours);
    onClose();
  };
  const handleBookingSelect = (hours: number) => setHours(hours);

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={onClose}
      disableRestoreFocus
      PaperProps={{
        style: {
          borderRadius: 12,
          padding: '16px',
          width: '400px',
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center' }}>
        {t('bookings.create', { sharedSpace: t(sharedSpace.nameCode) })}
      </DialogTitle>
      <DialogContent
        sx={{
          textAlign: 'center',
        }}
      >
        <DialogContentText
          id="alert-dialog-slide-description"
          sx={{ textAlign: 'center', mb: 2 }}
        >
          {formattedDate}
        </DialogContentText>
        <AccessTime color="primary" fontSize="large" />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          <BookingSwiper
            maxBookingHours={sharedSpace.maxBookingHours}
            hours={hours}
            onBookingSelect={handleBookingSelect}
          />
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Button onClick={onClose} variant="outlined" sx={{ minWidth: '120px' }}>
          {t('button.cancel')}
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          color="primary"
          sx={{ minWidth: '120px' }}
        >
          {t('button.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookingCreateDialog;
