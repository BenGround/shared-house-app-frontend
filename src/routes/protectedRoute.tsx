import React, { useEffect, useState, Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { t } from 'i18next';
import { useUser } from 'src/contexts/userContext';

interface ProtectedRouteProps {
  element: React.LazyExoticComponent<React.FC<any>>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated } = useUser();
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    setIsAuthChecked(isAuthenticated);
  }, [isAuthenticated]);

  if (!isAuthChecked) {
    return (
      <div style={{ textAlign: 'center', marginTop: '25vh' }}>
        <ClipLoader color="#007bff" size={50} /> <p>{t('checking.auth')}</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  const loadingElement = (
    <div style={{ textAlign: 'center', marginTop: '25vh' }}>
      <ClipLoader color="#007bff" size={50} /> <p>{t('loading.element')}</p>
    </div>
  );

  return (
    <Suspense fallback={loadingElement}>
      {React.createElement(element)}
    </Suspense>
  );
};

export default ProtectedRoute;
