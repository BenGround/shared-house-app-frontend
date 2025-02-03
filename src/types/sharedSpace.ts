export interface SharedSpace {
  id: number;
  nameCode: string;
  nameEn: string;
  nameJp: string;
  descriptionEn: string | null;
  descriptionJp: string | null;
  startDayTime: string;
  endDayTime: string;
  picture?: string;
  maxBookingHours: number;
  maxBookingByUser: number;
}
