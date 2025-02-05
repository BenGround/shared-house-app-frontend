import { DayPilot } from '@daypilot/daypilot-lite-react';
import { t } from 'i18next';

export function getHoursDifference(
  date1: Date | DayPilot.Date,
  date2: Date | DayPilot.Date
): number {
  const diffInMilliseconds = date2.getTime() - date1.getTime();
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  return diffInHours;
}

export const formatHour = (hoursValue: number) => {
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
