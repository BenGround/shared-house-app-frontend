import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import { t } from 'i18next';
import { useUser } from 'src/contexts/userContext';

interface ProtectedRouteProps {
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const { isAuthenticated, checkSession } = useUser();
  const [isAuthChecked, setIsAuthChecked] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      await checkSession();
      setIsAuthChecked(true);
    };

    checkAuth();
  }, [checkSession]);

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

  return <>{element}</>;
};

export default ProtectedRoute;
