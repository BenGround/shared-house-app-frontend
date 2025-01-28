import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import Box from '@mui/material/Box';
import { AuthLayout } from '../layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import ProtectedRoute from './protectedRoute';
import { useShareSpaces } from 'src/contexts/shareSpacesContext';
import { ClipLoader } from 'react-spinners';
import { useUser } from 'src/contexts/userContext';

export const HomePage = lazy(() => import('../pages/home'));
export const BookingsPage = lazy(() => import('../pages/bookings'));
export const UserPage = lazy(() => import('../pages/user'));
export const SignInPage = lazy(() => import('../pages/sign-in'));
export const Page404 = lazy(() => import('../pages/page-not-found'));
export const BookingCalendar = lazy(
  () => import('../sections/bookings/bookingCalendar')
);
export const CreatePassword = lazy(() => import('../pages/create-password'));
export const ProfilePage = lazy(() => import('../pages/profile'));

const renderFallback = (
  <Box sx={{ textAlign: 'center', marginTop: '25vh' }}>
    <ClipLoader color="#007bff" size={50} />
  </Box>
);

function Router() {
  const { isAuthenticated } = useUser();
  const { sharedSpaces, isLoading, error, done } = useShareSpaces();

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
          element: <ProtectedRoute element={HomePage} />,
          index: true,
        },
        {
          path: 'bookings',
          element:
            sharedSpaces.length > 0 ? (
              <Navigate to={`/bookings/${sharedSpaces[0]?.nameCode}`} replace />
            ) : (
              <Page404 />
            ),
        },
        {
          path: 'bookings/:sharedSpaceNameCode',
          element: <ProtectedRoute element={BookingsPage} />,
        },
        {
          element: <ProtectedRoute element={UserPage} />,
          path: 'user',
        },
        {
          element: <ProtectedRoute element={ProfilePage} />,
          path: 'profile',
        },
      ],
    },
    {
      path: 'create-password',
      element: isAuthenticated ? (
        <Navigate to="/" replace />
      ) : (
        <AuthLayout>
          <CreatePassword />
        </AuthLayout>
      ),
    },
    {
      path: 'sign-in',
      element: isAuthenticated ? (
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

export default Router;
