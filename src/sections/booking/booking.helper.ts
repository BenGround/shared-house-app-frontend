import { FrontBooking } from '@benhart44/shared-house-shared';

export const replaceOrAddBooking = (
  prevBookings: FrontBooking[],
  processedBooking: FrontBooking
) => {
  const updatedBookings = prevBookings.map((booking) =>
    booking.id === processedBooking.id ? processedBooking : booking
  );

  if (!prevBookings.some((booking) => booking.id === processedBooking.id)) {
    updatedBookings.push(processedBooking);
  }

  return updatedBookings;
};

export const updateTimeDate = (booking: any): void => {
  booking.startDate = new Date(booking.startDate).setHours(
    new Date(booking.startDate).getHours() + 9
  );
  booking.endDate = new Date(booking.endDate).setHours(
    new Date(booking.endDate).getHours() + 9
  );
};
