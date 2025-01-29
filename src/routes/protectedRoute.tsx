import React, { useEffect, useState, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from 'src/contexts/userContext';
import LoadingSpinner from 'src/components/loadingSpinner/loadingSpinner';

interface ProtectedRouteProps {
  element: React.LazyExoticComponent<React.FC<any>>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, authCallDone } = useUser();
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsAuthChecked(authCallDone);
    };

    checkAuth();
  }, [authCallDone]);

  if (!isAuthChecked) {
    return <LoadingSpinner translationKey="checking.auth" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  return (
    <Suspense fallback={<LoadingSpinner translationKey="loading.element" />}>
      {React.createElement(element)}
    </Suspense>
  );
};

export default ProtectedRoute;
