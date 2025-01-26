import { Label } from '../components/label';

export const navData = [
  {
    titleCode: 'home',
    path: '/',
  },
  {
    titleCode: 'reservation',
    path: '/bookings',
  },
  {
    titleCode: 'users',
    path: '/user',
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
    admin: true,
  },
];
