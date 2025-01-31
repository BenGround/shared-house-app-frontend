export interface SharedSpace {
  id: number;
  nameCode: string;
  description: string | null;
  startDayTime: string;
  endDayTime: string;
  maxBookingHours: number;
  maxBookingByUser: number;
}
