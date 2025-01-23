import 'swiper/css';
import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation } from 'react-i18next';

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

  const generateBookingHours = (maxHours: number) => {
    const hoursArray = [];
    for (let i = 0.5; i <= maxHours; i += 0.5) {
      hoursArray.push(i);
    }
    return hoursArray;
  };

  const bookingHours = generateBookingHours(maxBookingHours);

  useEffect(() => {
    const index = bookingHours.indexOf(hours);
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

  const formatHour = (hoursValue: number) => {
    const wholeHours = Math.floor(hoursValue);
    const minutes = (hoursValue - wholeHours) * 60;

    if (wholeHours === 0 && minutes > 0) {
      return `${minutes} ${t('bookings.mins')}`;
    }
    if (minutes === 0) {
      return `${wholeHours}${t('bookings.hours')}`;
    }
    return `${wholeHours}${t('bookings.hours')} ${minutes}${t('bookings.mins')}`;
  };

  return (
    <Box
      sx={{
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Select Booking Hours
      </Typography>

      {/* Wrapper to position Swiper and buttons */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Left Button */}
        <IconButton
          onClick={handlePrev}
          disabled={swiperInstance?.activeIndex === 0}
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
          disabled={swiperInstance?.activeIndex === bookingHours.length - 1}
          sx={{
            position: 'absolute',
            right: -10, // Shift slightly outward
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
