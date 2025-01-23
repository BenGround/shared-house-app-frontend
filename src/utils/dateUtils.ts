import { DayPilot } from '@daypilot/daypilot-lite-react';

export function getHoursDifference(
  date1: Date | DayPilot.Date,
  date2: Date | DayPilot.Date
): number {
  const diffInMilliseconds = date2.getTime() - date1.getTime();
  const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
  return diffInHours;
}
