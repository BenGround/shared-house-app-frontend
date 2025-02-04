import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import { AuthLayout } from '../layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import ProtectedRoute from './protectedRoute';
import { useSharedSpaces } from 'src/contexts/shareSpacesContext';
import { useUser } from 'src/contexts/userContext';
import LoadingSpinner from 'src/components/loadingSpinner/loadingSpinner';

export const HomePage = lazy(() => import('../pages/home'));
export const BookingsPage = lazy(() => import('../pages/bookings'));
export const UserPage = lazy(() => import('../pages/user'));
export const SharedspacePage = lazy(() => import('../pages/sharedspace'));
export const SignInPage = lazy(() => import('../pages/sign-in'));
export const Page404 = lazy(() => import('../pages/page-not-found'));
export const BookingCalendar = lazy(
  () => import('../sections/booking/bookingCalendar')
);
export const CreatePassword = lazy(() => import('../pages/create-password'));
export const ProfilePage = lazy(() => import('../pages/profile'));

const renderFallback = <LoadingSpinner translationKey="loading.routes" />;

function Router() {
  const { isAuthenticated, user, authCallDone } = useUser();
  const { sharedSpaces, isLoading } = useSharedSpaces();

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
          path: 'user',
          element: Boolean(user?.isAdmin) ? (
            <ProtectedRoute element={UserPage} />
          ) : (
            <Navigate to="/" replace />
          ),
        },
        {
          path: 'sharedspace',
          element: Boolean(user?.isAdmin) ? (
            <ProtectedRoute element={SharedspacePage} />
          ) : (
            <Navigate to="/" replace />
          ),
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

  if (!authCallDone || isLoading) {
    return renderFallback;
  }

  return routes;
}

export default Router;
