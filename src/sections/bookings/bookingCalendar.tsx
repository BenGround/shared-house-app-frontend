import React, { useCallback, useState, useEffect } from 'react';
import { Card, ButtonGroup, Button, Box, Typography } from '@mui/material';
import { DayPilot, DayPilotCalendar } from '@daypilot/daypilot-lite-react';
import { useUser } from 'src/contexts/userContext';
import moment from 'moment-timezone';
import BookingModal from './bookingModal';
import { Booking } from 'src/types/booking';
import { toast } from 'react-toastify';
import axiosInstance from 'src/settings/axiosInstance';
import { useTranslation } from 'react-i18next';
import { SharedSpace } from 'src/types/sharedSpace';
import { getHoursDifference } from 'src/utils/dateUtils';
import BookingCreateDialog from './bookingCreateDialog';
import { ClipLoader } from 'react-spinners';
import { handleError } from 'src/utils/errorHandler';

type BookingCalendarProps = {
  sharedSpace: SharedSpace | null;
};

const BookingCalendar: React.FC<BookingCalendarProps> = ({ sharedSpace }) => {
  const isMobile = window.innerWidth <= 768;
  const { user } = useUser();
  const { i18n, t } = useTranslation();
  const language = i18n.language === 'en' ? 'en-US' : 'ja-JP';
  const [startDate, setStartDate] = useState<DayPilot.Date>(
    new DayPilot.Date()
  );
  const [events, setEvents] = useState<DayPilot.EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<DayPilot.EventData | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDateSelection, setStartDateSelection] = useState<DayPilot.Date>(
    new DayPilot.Date()
  );
  const [bookingTimeHours, setBookingTimeHours] = useState<number>(0);
  const [numberBookings, setNumberBookings] = useState<number>(0);

  const fetchBookings = useCallback(async () => {
    if (!sharedSpace) return;
    try {
      const response = await axiosInstance.get(`bookings/${sharedSpace.id}`, {
        params: {
          startDate: startDate.toString('yyyy-MM-dd'),
          endDate: startDate.addDays(7).toString('yyyy-MM-dd'),
        },
      });

      const newEvents = response.data.map((booking: Booking) => ({
        id: booking.id,
        start: booking.startDate,
        end: booking.endDate,
        text: booking.username,
      }));
      setEvents(newEvents);
    } catch (error: Error | any) {
      handleError(error);
    }
  }, [sharedSpace, startDate]);

  const fetchNumberBookingsByUser = useCallback(async () => {
    if (!sharedSpace) return;
    try {
      const response = await axiosInstance.get(
        `bookings/number/${sharedSpace.id}`,
        {
          withCredentials: true,
        }
      );

      setNumberBookings(response.data.count);
    } catch (error: Error | any) {
      handleError(error);
    }
  }, [sharedSpace]);

  useEffect(() => {
    fetchBookings();
    fetchNumberBookingsByUser();
  }, [fetchBookings, fetchNumberBookingsByUser]);

  if (!sharedSpace) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: '25vh' }}>
        <ClipLoader color="#007bff" size={50} />{' '}
        <p>{t('checking.sharedspace')}</p>
      </Box>
    );
  }

  const handlePreviousWeek = () => setStartDate((prev) => prev.addDays(-7));
  const handleNextWeek = () => setStartDate((prev) => prev.addDays(7));

  const handleTimeRangeSelected = async (
    args: DayPilot.CalendarTimeRangeSelectedArgs
  ) => {
    setStartDateSelection(args.start);
    const endDateSelected = args.end;
    const hoursDiff = getHoursDifference(args.start, endDateSelected);
    setBookingTimeHours(getHoursDifference(args.start, endDateSelected));

    if (args.start < new DayPilot.Date()) {
      toast.error(t('bookings.cannotBookInPast'));
      args.control.clearSelection();
      return;
    }

    if (hoursDiff > sharedSpace.maxBookingHours) {
      toast.error(
        t('bookings.maxBookingHoursExceeded', {
          hours: sharedSpace.maxBookingHours,
        })
      );
      args.control.clearSelection();
      return;
    }

    setDialogOpen(true);
  };

  const handleEventClick = (args: DayPilot.CalendarEventClickArgs) => {
    setSelectedEvent(args.e.data);
    setModalOpen(true);
  };

  const handleDelete = async (args: DayPilot.CalendarEventDeleteArgs) => {
    args.preventDefault();
    if (new DayPilot.Date(args.e.data.start) < new DayPilot.Date()) {
      toast.warn(t('bookings.cannotDeletePastBookings'));
      return;
    }

    const confirmed = window.confirm(t('bookings.confirmDelete'));
    if (!confirmed) {
      return;
    }

    try {
      const eventId = args.e.data.id;
      const response = await axiosInstance.delete(`bookings/${eventId}`, {
        withCredentials: true,
      });
      if (response.status === 204) {
        toast.info(t('bookings.deleteSuccess'));
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
        fetchNumberBookingsByUser();
      } else {
        throw new Error(response.data);
      }
    } catch (error: Error | any) {
      handleError(error);
    }
  };

  const createBookingApiCall = async (startDate: Date, hours: number) => {
    try {
      const tokyoStartDate = moment.tz(startDate, 'Asia/Tokyo');
      const tokyoEndDate = tokyoStartDate.clone().add(hours, 'hours');

      const response = await axiosInstance.post(
        'bookings/create',
        {
          sharedSpaceId: sharedSpace.id,
          startDate: tokyoStartDate.clone().utc().toISOString(),
          endDate: tokyoEndDate.clone().utc().toISOString(),
        },
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success(t('bookings.createSuccess'));
        fetchNumberBookingsByUser();
      } else {
        throw new Error(response.data);
      }

      tokyoStartDate.hours(tokyoStartDate.hours() + 9);
      tokyoEndDate.hours(tokyoEndDate.hours() + 9);

      const newEvent = {
        id: response.data.booking.id,
        start: new DayPilot.Date(tokyoStartDate.format()),
        end: new DayPilot.Date(tokyoEndDate.format()),
        text: user?.username || t('bookings.newBooking'),
      };

      setEvents((prevEvents) => [...prevEvents, newEvent]);
    } catch (error: Error | any) {
      handleError(error);
    }
  };

  return (
    <Box
      sx={{
        mb: { xs: 3, md: 5 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Card variant="outlined" sx={{ width: '100%', padding: 2 }}>
        <Box
          sx={{
            width: '100%',
            backgroundImage: `url('/assets/sharedSpaces/${sharedSpace.nameCode}.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
            color: 'white',
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px #000000' }}
          >
            {t(sharedSpace.nameCode)}
          </Typography>
          <Typography variant="body1">{sharedSpace.description}</Typography>

          <Typography variant="body1">
            {t('bookings.maxBookingHours', {
              hours: sharedSpace.maxBookingHours,
            })}
          </Typography>
          <Typography variant="body1">
            {t('bookings.remaining', {
              remaining: Math.max(
                sharedSpace.maxBookingByUser - numberBookings,
                0
              ),
            })}
          </Typography>
        </Box>

        <Box
          sx={{ width: '100%', padding: 2 }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            {t('bookings.weekNumber', {
              week: startDate.weekNumber(),
              year: startDate.getYear(),
            })}
          </Typography>

          {isMobile && (
            <Typography variant="h6">
              {startDate.toDate().toLocaleString(language, { month: 'long' })}
            </Typography>
          )}
        </Box>

        <ButtonGroup variant="contained" sx={{ width: '100%' }}>
          <Button
            onClick={handlePreviousWeek}
            sx={{
              textTransform: 'none',
              width: '50%',
              borderRadius: '5px 0px 0px 0px',
            }}
          >
            {t('bookings.previousWeek')}
          </Button>
          <Button
            onClick={handleNextWeek}
            sx={{
              textTransform: 'none',
              width: '50%',
              borderRadius: '0px 5px 0px 0px',
            }}
          >
            {t('bookings.nextWeek')}
          </Button>
        </ButtonGroup>

        <DayPilotCalendar
          durationBarVisible
          timeRangeSelectedHandling="Enabled"
          onTimeRangeSelected={handleTimeRangeSelected}
          events={events}
          headerDateFormat={isMobile ? 'dd' : 'MMMM dd'}
          viewType="Week"
          startDate={startDate}
          onEventClick={handleEventClick}
          onEventDelete={handleDelete}
          eventMoveHandling="Disabled"
          eventResizeHandling="Disabled"
          eventDeleteHandling="Update"
          heightSpec="BusinessHoursNoScroll"
          businessBeginsHour={parseInt(sharedSpace.startDayTime.split(':')[0])}
          businessEndsHour={parseInt(sharedSpace.endDayTime.split(':')[0])}
          eventBorderRadius="0.5rem"
          headerHeight={20}
          headerTextWrappingEnabled={true}
          hourWidth={50}
          locale={language}
          xssProtection={'Enabled'}
          onBeforeCellRender={(args) => {
            const { cell } = args;
            if (cell.start < new DayPilot.Date()) {
              cell.properties.backColor = '#e7e7e7';
            }
          }}
          onBeforeEventRender={(args) => {
            const now = new DayPilot.Date();
            const eventStart = args.data.start;
            const eventEnd = args.data.end;

            if (eventStart <= now && now < eventEnd) {
              args.data.backColor = '#e6fff2';
              args.data.text = `${args.data.text} - ${t('bookings.ongoing')}`;
            }
            if (args.data.text !== user?.username) {
              args.data.barHidden = true;
            }
          }}
        />
      </Card>
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedEvent={selectedEvent}
      />

      <BookingCreateDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        sharedSpace={sharedSpace}
        startDate={startDateSelection}
        bookingTimeHours={bookingTimeHours}
        onCreateBooking={createBookingApiCall}
      />
    </Box>
  );
};

export default BookingCalendar;
