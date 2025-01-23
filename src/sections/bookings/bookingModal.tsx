import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';
import { DayPilot } from '@daypilot/daypilot-lite-react';

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  selectedEvent: DayPilot.EventData | null;
};

const BookingModal: React.FC<BookingModalProps> = ({
  open,
  onClose,
  selectedEvent,
}) => {
  if (!selectedEvent) return null;

  return (
    <Dialog open={open} onClose={onClose} disableRestoreFocus>
      <DialogTitle>Booking from {selectedEvent.text}</DialogTitle>
      <DialogContent>
        {new DayPilot.Date(selectedEvent.start).toString('dd MMMM yyyy HH:mm')}{' '}
        - {new DayPilot.Date(selectedEvent.end).toString('HH:mm')}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
