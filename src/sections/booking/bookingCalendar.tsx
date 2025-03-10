import React, {
  useCallback,
  useState,
  useEffect,
  Suspense,
  useMemo,
  useRef,
  ChangeEvent,
} from 'react';
import {
  Card,
  ButtonGroup,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
} from '@mui/material';
import { useUser } from 'src/contexts/userContext';
import { useTranslation } from 'react-i18next';
import { getHoursDifference } from 'src/utils/dateTimeUtils';
import { handleError } from 'src/utils/errorHandler';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import { toast } from 'react-toastify';
import axiosInstance from 'src/settings/axiosInstance';
import LoadingSpinner from 'src/components/loadingSpinner/loadingSpinner';
import { io, Socket } from 'socket.io-client';
import { Iconify } from 'src/components/iconify';
import { validateFile } from 'src/utils/imgUtils';
import { isMobileWindows } from 'src/utils/utils';
import { useSharedSpaces } from 'src/contexts/shareSpacesContext';
import { replaceOrAddBooking, updateTimeDate } from './booking.helper';
import { FrontBooking, FrontSharedSpace } from '@benhart44/shared-house-shared';

const BookingModal = React.lazy(() => import('./bookingModal'));
const BookingCreateDialog = React.lazy(() => import('./bookingCreateDialog'));
const DayPilotCalendar = React.lazy(() =>
  import('@daypilot/daypilot-lite-react').then((mod) => ({
    default: mod.DayPilotCalendar,
  }))
);

type BookingCalendarProps = {
  sharedSpace: FrontSharedSpace;
  isFetching: (fetching: boolean) => void;
};

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  sharedSpace,
  isFetching: isCallingApi,
}) => {
  const { user } = useUser();
  const { i18n, t } = useTranslation();
  const { updateSharedSpacePicture, removeSharedSpacePicture } =
    useSharedSpaces();
  const theme = useTheme();

  const socketRef = useRef<Socket | null>(null);
  const isMobile = isMobileWindows();
  const isEn = i18n.language === 'en';
  const language = isEn ? 'en-US' : 'ja-JP';

  const [bookings, setBookings] = useState<FrontBooking[]>([]);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bookingTimeHours, setBookingTimeHours] = useState<number>(0);
  const [remainingsBookings, setRemainingBookings] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [eventCache, setEventCache] = useState<Set<string>>(new Set());
  const [startDate, setStartDate] = useState<DayPilot.Date>(
    isMobile
      ? new DayPilot.Date().getDatePart()
      : new DayPilot.Date().firstDayOfWeek().getDatePart()
  );
  const [startDateSelection, setStartDateSelection] = useState<DayPilot.Date>(
    new DayPilot.Date()
  );
  const [selectedEvent, setSelectedEvent] = useState<DayPilot.EventData | null>(
    null
  );
  const [disabledImgButttons, setDisabledImgButttons] =
    useState<boolean>(false);
  const [picture, setPicture] = useState<string | undefined>(
    sharedSpace.picture
  );

  const memoizedEvents = useMemo(() => {
    return bookings.map((booking: FrontBooking) => ({
      id: booking.id,
      start: booking.startDate,
      end: booking.endDate,
      text: booking.roomNumber,
    }));
  }, [bookings]);

  const generateCacheKey = (
    startDate: DayPilot.Date,
    endDate: DayPilot.Date
  ) => {
    return `${startDate.toString('yyyy-MM-dd')}_${endDate.toString(
      'yyyy-MM-dd'
    )}`;
  };

  const eventConflict = (start: Date, end: Date, bookingId?: number) => {
    return bookings.some((booking) => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);

      const isDifferentBooking = bookingId ? booking.id !== bookingId : true;
      const isOverlapping = start < bookingEnd && end > bookingStart;

      return isDifferentBooking && isOverlapping;
    });
  };

  const fetchBookings = useCallback(async () => {
    const endDate = startDate.addDays(isMobile ? 1 : 7);
    const cacheKey = generateCacheKey(startDate, endDate);

    if (eventCache.has(cacheKey)) return;

    try {
      setLoading(true);
      isCallingApi(true);
      const response = await axiosInstance.get(`bookings/${sharedSpace.id}`, {
        withCredentials: true,
        params: {
          startDate: startDate.toString('yyyy-MM-dd'),
          endDate: endDate.toString('yyyy-MM-dd'),
        },
      });

      setEventCache((prevEventCache) => {
        const newCache = new Set(prevEventCache);
        newCache.add(cacheKey);
        return newCache;
      });

      setBookings((prevBookings) => {
        const combined = [...prevBookings, ...response.data?.data];
        const uniqueBookings = Array.from(
          new Map(combined.map((booking) => [booking.id, booking])).values()
        );
        return uniqueBookings;
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
      isCallingApi(false);
    }
  }, [sharedSpace, startDate, isMobile, eventCache]);

  const fetchNumberBookingsByUser = useCallback(async () => {
    try {
      isCallingApi(true);
      const response = await axiosInstance.get(
        `bookings/number/${sharedSpace.id}`,
        {
          withCredentials: true,
        }
      );
      setRemainingBookings(
        Math.max(0, sharedSpace.maxBookingByUser - response.data?.data)
      );
    } catch (error: Error | any) {
      handleError(error);
    } finally {
      isCallingApi(false);
    }
  }, [sharedSpace]);

  const handleTimeRangeSelected = async (
    args: DayPilot.CalendarTimeRangeSelectedArgs
  ) => {
    if (remainingsBookings < 1) {
      toast.error(t('errors.booking.too.many'));
      args.control.clearSelection();
      return;
    }

    if (args.start < new DayPilot.Date()) {
      toast.error(t('errors.booking.cannotBookInPast'));
      args.control.clearSelection();
      return;
    }

    const startDateSelected = args.start;
    const hoursDiff = Math.min(
      getHoursDifference(startDateSelected, args.end),
      sharedSpace.maxBookingHours
    );

    setStartDateSelection(startDateSelected);
    setBookingTimeHours(hoursDiff);
    setDialogOpen(true);
  };

  const deleteEvent = async (eventId: number) => {
    const confirmed = window.confirm(t('bookings.confirmDelete'));
    if (!confirmed) return;

    try {
      isCallingApi(true);
      setLoading(true);
      const response = await axiosInstance.delete(`bookings/${eventId}`, {
        withCredentials: true,
      });
      if (response.status === 204) {
        toast.info(t('bookings.deleteSuccess'));
        setBookings((prevEvents) =>
          prevEvents.filter((event) => event.id !== eventId)
        );
        setRemainingBookings((old) => Math.max(0, old + 1));
      } else {
        throw new Error(response.data);
      }
    } catch (error: Error | any) {
      handleError(error);
    } finally {
      setLoading(false);
      isCallingApi(false);
    }
  };

  const createBookingApiCall = async (
    startDateCreation: Date,
    hours: number
  ) => {
    try {
      isCallingApi(true);
      setLoading(true);
      const tokyoStartDate = startDateCreation;
      const tokyoEndDate = new Date(tokyoStartDate);
      tokyoEndDate.setMinutes(tokyoEndDate.getMinutes() + hours * 60);

      if (eventConflict(tokyoStartDate, tokyoEndDate)) {
        throw new Error('booking.already.existing');
      }

      const response = await axiosInstance.post(
        'bookings/create',
        {
          sharedSpaceId: sharedSpace.id,
          startDate: tokyoStartDate.toISOString(),
          endDate: tokyoEndDate.toISOString(),
        },
        { withCredentials: true }
      );

      const booking = response.data?.data;

      if (response.status === 201) {
        toast.success(t('bookings.create.success'));
        setRemainingBookings((old) => Math.max(0, old - 1));
      } else {
        throw new Error(booking);
      }

      updateTimeDate(booking);
      setBookings((prevBookings) => [...prevBookings, booking]);
    } catch (error: Error | any) {
      handleError(error);
    } finally {
      setLoading(false);
      isCallingApi(false);
    }
  };

  const handleEventClick = (args: DayPilot.CalendarEventClickArgs) => {
    setSelectedEvent(args.e.data);
    setInfoModalOpen(true);
  };

  const updateBookingApiCall = async (
    evendId: number,
    newStartDatePilot: DayPilot.Date,
    newEndDatePilot: DayPilot.Date
  ) => {
    let updateSuccess = false;
    const booking = bookings.find((book) => book.id === evendId);
    if (!booking) throw new Error();

    const newStart = new Date(newStartDatePilot.toString());
    const newEnd = new Date(newEndDatePilot.toString());

    const oldStart = new Date(booking.startDate);
    const oldEnd = new Date(booking.endDate);
    const now = new Date();

    if (
      oldStart.toISOString() === newStart.toISOString() &&
      oldEnd.toISOString() === newEnd.toISOString()
    ) {
      return;
    }

    try {
      if (booking.roomNumber !== user?.roomNumber) {
        throw new Error('booking.other.user');
      }

      if (eventConflict(newStart, newEnd, booking.id)) {
        throw new Error('booking.already.existing');
      }

      if (oldStart < now) {
        throw new Error('booking.cannotUpdatePastBookings');
      }

      if (newStart < now) {
        throw new Error('booking.cannotBookInPast');
      }

      isCallingApi(true);
      setLoading(true);
      const response = await axiosInstance.put(
        'bookings/update',
        {
          id: booking.id,
          sharedSpaceId: sharedSpace.id,
          startDate: newStart.toISOString(),
          endDate: newEnd.toISOString(),
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success(t('bookings.update.success'));
        updateSuccess = true;
      } else {
        throw new Error('Failed to update booking');
      }
    } catch (error: Error | any) {
      handleError(error);
    } finally {
      isCallingApi(false);
      setLoading(false);
      setBookings((prevBookings) =>
        prevBookings.map((prevBooking) =>
          prevBooking.id === evendId && updateSuccess
            ? {
                ...prevBooking,
                startDate: updateSuccess
                  ? newStartDatePilot.toString()
                  : booking.startDate,
                endDate: updateSuccess
                  ? newEndDatePilot.toString()
                  : booking.endDate,
              }
            : prevBooking
        )
      );
    }
  };

  const handleSharedSpaceImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const validationError = validateFile(file);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      setDisabledImgButttons(true);
      const result = await updateSharedSpacePicture(file, sharedSpace.id);

      if (result) {
        const reader = new FileReader();
        reader.onload = () => setPicture(reader.result as string);
        reader.readAsDataURL(file);
      }
      setDisabledImgButttons(false);
    } else {
      toast.error(t('file.not.loaded'));
    }
  };

  const handleSharedSpaceImageDelete = async () => {
    const confirmed = window.confirm(t('picture.confirmDelete'));
    if (!confirmed) return;

    setDisabledImgButttons(true);
    const result = await removeSharedSpacePicture(sharedSpace.id);
    setDisabledImgButttons(false);
    if (result) setPicture(undefined);
  };

  const handleResizeEvent = async (args: DayPilot.CalendarEventResizeArgs) => {
    updateBookingApiCall(args.e.data.id, args.newStart, args.newEnd);
  };
  const handleMoveEvent = async (args: DayPilot.CalendarEventMoveArgs) => {
    updateBookingApiCall(args.e.data.id, args.newStart, args.newEnd);
  };

  const handlePrevious = () =>
    setStartDate((prev) => prev.addDays(isMobile ? -1 : -7));
  const handleNext = () =>
    setStartDate((prev) => prev.addDays(isMobile ? 1 : 7));

  const hasFetched = useRef(false);
  useEffect(() => {
    setPicture(sharedSpace.picture);
    setBookings([]);
    setIsImageLoaded(false);
    setEventCache(new Set<string>());
    fetchNumberBookingsByUser();
    hasFetched.current = false;

    if (sharedSpace.picture) {
      const img = new Image();
      img.src = sharedSpace.picture;

      img.onload = () => setIsImageLoaded(true);
      img.onerror = () => setIsImageLoaded(false);
    }
  }, [sharedSpace]);
  useEffect(() => {
    hasFetched.current = false;
  }, [startDate]);
  useEffect(() => {
    if (!hasFetched.current) {
      fetchBookings();
      hasFetched.current = true;
    }
  }, [eventCache, startDate]);
  useEffect(() => {
    const backendUrl = process.env.REACT_APP_WS_URL;
    if (!sharedSpace || !backendUrl) return;

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(backendUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    socket.on('newBooking', (newBooking: FrontBooking) => {
      if (
        newBooking.roomNumber === user?.roomNumber ||
        newBooking.sharedSpaceId !== sharedSpace.id
      )
        return;

      updateTimeDate(newBooking);
      setBookings((prevBookings) =>
        replaceOrAddBooking(prevBookings, newBooking)
      );
    });

    socket.on('updatedBooking', (updatedBooking: FrontBooking) => {
      if (
        updatedBooking.roomNumber === user?.roomNumber ||
        updatedBooking.sharedSpaceId !== sharedSpace.id
      )
        return;

      updateTimeDate(updatedBooking);
      setBookings((prevBookings) =>
        replaceOrAddBooking(prevBookings, updatedBooking)
      );
    });

    socket.on('deletedBooking', (deletedBooking: FrontBooking) => {
      if (
        deletedBooking.roomNumber === user?.roomNumber ||
        deletedBooking.sharedSpaceId !== sharedSpace.id
      )
        return;
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== deletedBooking.id)
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [sharedSpace]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Card variant="outlined" sx={{ width: '100%', padding: 1 }}>
        <Box
          sx={{
            width: '100%',
            backgroundImage: isImageLoaded ? `url(${picture})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
            color: isImageLoaded ? 'white' : theme.vars.palette.text.primary,
            position: 'relative',
          }}
        >
          {user?.isAdmin && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                display: 'flex',
                gap: 1,
              }}
            >
              <label>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleSharedSpaceImageChange}
                  aria-label={t('profile.upload.picture')}
                />
                <IconButton
                  aria-label="add-image"
                  onClick={() => {}}
                  disabled={disabledImgButttons}
                  sx={{ color: isImageLoaded ? 'white' : 'gray' }}
                  component="span"
                >
                  <Iconify icon="mdi:image-plus" />
                </IconButton>
              </label>
              <IconButton
                aria-label="remove-image"
                onClick={handleSharedSpaceImageDelete}
                disabled={disabledImgButttons || !sharedSpace.picture}
                sx={{ color: isImageLoaded ? 'white' : 'gray' }}
                component="span"
              >
                <Iconify icon="mdi:image-remove" />{' '}
              </IconButton>
            </Box>
          )}

          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              textShadow: isImageLoaded ? '2px 2px 4px #000000' : 'none',
            }}
          >
            {isEn ? sharedSpace.nameEn : sharedSpace.nameJp}
          </Typography>
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', marginBottom: 3 }}
          >
            {isEn ? sharedSpace.descriptionEn : sharedSpace.descriptionJp}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            {t('bookings.maxBookingHours', {
              hours: sharedSpace.maxBookingHours,
            })}
          </Typography>
          <Typography variant="body1">
            {t('bookings.remaining', {
              remainingsBookings,
            })}
          </Typography>
        </Box>
        <Box
          sx={{ width: '100%', paddingTop: 2 }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          {!isMobile && (
            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', paddingBottom: 2 }}
            >
              {t('bookings.weekNumber', {
                week: startDate.weekNumber(),
                year: startDate.getYear(),
              })}
            </Typography>
          )}
          <ButtonGroup variant="contained" sx={{ width: '100%' }}>
            <Button
              onClick={handlePrevious}
              sx={{
                textTransform: 'none',
                width: '50%',
                borderRadius: '5px 0px 0px 0px',
              }}
            >
              {isMobile
                ? t('bookings.previousDay')
                : t('bookings.previousWeek')}
            </Button>
            <Button
              onClick={handleNext}
              sx={{
                textTransform: 'none',
                width: '50%',
                borderRadius: '0px 5px 0px 0px',
              }}
            >
              {isMobile ? t('bookings.nextDay') : t('bookings.nextWeek')}
            </Button>
          </ButtonGroup>
          <Suspense>
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                }}
              >
                <LoadingSpinner />
              </Box>
            )}
            <DayPilotCalendar
              durationBarVisible
              timeRangeSelectedHandling="Enabled"
              onTimeRangeSelected={handleTimeRangeSelected}
              events={memoizedEvents}
              headerDateFormat="MMMM dd"
              viewType={isMobile ? 'Days' : 'Week'}
              startDate={startDate}
              onEventClick={handleEventClick}
              onEventMove={handleMoveEvent}
              onEventResize={handleResizeEvent}
              heightSpec="BusinessHoursNoScroll"
              businessBeginsHour={parseInt(
                sharedSpace.startDayTime.split(':')[0]
              )}
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

                const actualBooking = bookings.find(
                  (booking) => booking.id === args.data.id
                );

                if (actualBooking) {
                  const nameText = actualBooking.username
                    ? `${actualBooking.roomNumber} - ${actualBooking.username}`
                    : actualBooking.roomNumber;

                  const avatarHtml = actualBooking.picture
                    ? `<div style="display: flex; align-items: flex-start; position: relative; padding-right: 20px; height: 10%">
                        <div style="position: absolute; top: 0; right: 0; margin: 3px;">
                          <img
                            src="${String(actualBooking.picture)}"
                            style="width: 20px; height: 20px; border-radius: 50%;"
                          />
                        </div>
                        <div style="flex: 1; display: flex; flex-direction: column; padding-top: 2px">
                          <span style="white-space: normal; overflow: hidden; text-overflow: ellipsis; word-wrap: break-word;">
                            ${nameText}
                          </span>
                        </div>
                      </div>`
                    : `<div style="display: flex; align-items: center">
                        <span>${nameText}</span>
                      </div>`;
                  args.data.html = avatarHtml;
                }

                if (eventStart <= now && now < eventEnd) {
                  args.data.backColor = '#e6fff2';
                  args.data.text = `${args.data.text} - ${t(
                    'bookings.ongoing'
                  )}`;
                }

                if (args.data.text !== user?.roomNumber) {
                  args.data.backColor = '#eaeaea';
                }
              }}
            />
          </Suspense>
        </Box>
      </Card>
      <Suspense>
        {infoModalOpen && selectedEvent && (
          <BookingModal
            open={infoModalOpen}
            onClose={() => setInfoModalOpen(false)}
            selectedEvent={selectedEvent}
            onDelete={(id) => deleteEvent(id)}
          />
        )}
        {dialogOpen && (
          <BookingCreateDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            sharedSpace={sharedSpace}
            startDate={startDateSelection}
            bookingTimeHours={bookingTimeHours}
            onCreateBooking={createBookingApiCall}
          />
        )}
      </Suspense>
    </Box>
  );
};

export default BookingCalendar;
