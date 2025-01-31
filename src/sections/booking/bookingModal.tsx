import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import { useTranslation } from 'react-i18next';
import { useUser } from 'src/contexts/userContext';

type BookingModalProps = {
  open: boolean;
  onClose: () => void;
  selectedEvent: DayPilot.EventData;
  onDelete: (eventId: number) => void;
};

const BookingModal: React.FC<BookingModalProps> = ({
  open,
  onClose,
  selectedEvent,
  onDelete,
}) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const handleDelete = () => {
    if (selectedEvent.id) {
      onDelete(selectedEvent.id as number);
    }
    onClose();
  };

  const canDelete =
    Boolean(selectedEvent) &&
    new DayPilot.Date(selectedEvent.start) > new DayPilot.Date() &&
    selectedEvent.text === user?.roomNumber;

  return (
    <Dialog open={open} onClose={onClose} disableRestoreFocus>
      <DialogTitle>{t(selectedEvent.text, 'Booking from')}</DialogTitle>
      <DialogContent>
        {new DayPilot.Date(selectedEvent.start).toString('dd MMMM yyyy HH:mm')}{' '}
        - {new DayPilot.Date(selectedEvent.end).toString('HH:mm')}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="info">
          Close
        </Button>
        {canDelete && (
          <Button onClick={handleDelete} color="primary">
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BookingModal;
