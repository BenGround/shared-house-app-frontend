import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';

import { AuthLayout } from '../layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import ProtectedRoute from './protectedRoute';
import { useShareSpaces } from 'src/contexts/shareSpacesContext';
import { ClipLoader } from 'react-spinners';

export const HomePage = lazy(() => import('../pages/home'));
export const BookingsPage = lazy(() => import('../pages/bookings'));
export const UserPage = lazy(() => import('../pages/user'));
export const SignInPage = lazy(() => import('../pages/sign-in'));
export const Page404 = lazy(() => import('../pages/page-not-found'));
export const BookingCalendar = lazy(
  () => import('../sections/bookings/bookingCalendar')
);

const renderFallback = (
  <Box sx={{ textAlign: 'center', marginTop: '25vh' }}>
    <ClipLoader color="#007bff" size={50} />
  </Box>
);

const isAuthenticated = () => {
  return localStorage.getItem('auth_token') !== null;
};

export function Router() {
  const { sharedSpaces, isLoading, error, fetchSharePlaces } = useShareSpaces();

  useEffect(() => {
    if (sharedSpaces.length === 0) {
      fetchSharePlaces();
    }
  }, [sharedSpaces, fetchSharePlaces]);

  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: <ProtectedRoute element={<HomePage />} />,
          index: true,
        },
        {
          path: 'bookings',
          element:
            sharedSpaces.length > 0 ? (
              <Navigate to={`/bookings/${sharedSpaces[0]?.nameCode}`} replace />
            ) : (
              <Page404 /> // Fallback to 404 if sharedSpaces is empty
            ),
        },
        {
          path: 'bookings/:sharedSpaceNameCode',
          element: <ProtectedRoute element={<BookingsPage />} />,
        },
        {
          element: <ProtectedRoute element={<UserPage />} />,
          path: 'user',
        },
      ],
    },
    {
      path: 'sign-in',
      element: isAuthenticated() ? (
        <Navigate to="/" replace />
      ) : (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  if (isLoading || error || sharedSpaces.length === 0) {
    return renderFallback;
  }

  return routes;
}
