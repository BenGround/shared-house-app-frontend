import 'swiper/css';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation } from 'react-i18next';
import { formatHour } from 'src/utils/dateTimeUtils';

type BookingModalProps = {
  maxBookingHours: number;
  hours: number;
  onBookingSelect: (hours: number) => void;
};

const BookingSwiper: React.FC<BookingModalProps> = ({
  maxBookingHours,
  hours,
  onBookingSelect: onHoursSelect,
}) => {
  const { t } = useTranslation();
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  const [indexHours, setIndex] = useState<number>(-1);

  const generateBookingHours = (maxHours: number): number[] => {
    const hoursArray = [];
    for (let i = 0.5; i <= maxHours; i += 0.5) {
      hoursArray.push(i);
    }
    return hoursArray;
  };

  const bookingHours = generateBookingHours(maxBookingHours);

  useEffect(() => {
    const index = bookingHours.indexOf(hours);
    setIndex(index);
    swiperInstance?.slideTo(index, 0);
  }, [hours, bookingHours, swiperInstance]);

  const handleNext = () => {
    swiperInstance?.slideNext();
  };

  const handlePrev = () => {
    swiperInstance?.slidePrev();
  };

  const handleSelect = (hoursValue: number) => {
    onHoursSelect(hoursValue);
    const index = bookingHours.indexOf(hoursValue);
    swiperInstance?.slideTo(index);
  };

  const handleSlideChange = (swiper: any) => {
    const currentSlideIndex = swiper?.activeIndex;
    const selectedHour = bookingHours[currentSlideIndex];
    handleSelect(selectedHour);
  };

  return (
    <Box
      sx={{
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        {t('select.booking.hours')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={handlePrev}
          disabled={indexHours < 1}
          sx={{
            position: 'absolute',
            left: -10,
            zIndex: 10,
            width: 50,
            height: 50,
            borderRadius: '50%',
            boxShadow: 4,
          }}
        >
          <ArrowLeft sx={{ fontSize: 30 }} />
        </IconButton>

        <Box sx={{ width: '70%' }}>
          <Swiper
            slidesPerView={1}
            freeMode={false}
            grabCursor={false}
            loop={false}
            centeredSlides={true}
            onSwiper={setSwiperInstance}
            onSlideChange={handleSlideChange}
          >
            {bookingHours.map((hoursValue, index) => (
              <SwiperSlide key={hoursValue} style={{ width: 'auto' }}>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ padding: 2, fontSize: 18 }}
                  onClick={() => handleSelect(hoursValue)}
                >
                  {formatHour(hoursValue)}
                </Button>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        <IconButton
          onClick={handleNext}
          disabled={indexHours >= bookingHours.length - 1}
          sx={{
            position: 'absolute',
            right: -10,
            zIndex: 10,
            width: 50,
            height: 50,
            borderRadius: '50%',
            boxShadow: 4,
          }}
        >
          <ArrowRight sx={{ fontSize: 30 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default BookingSwiper;
