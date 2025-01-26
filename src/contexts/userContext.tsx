import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axiosInstance from 'src/settings/axiosInstance';

interface User {
  username: string;
  roomNumber: string;
  email: string;
  isAdmin: boolean;
}

interface LoginResponse {
  status: boolean;
  message: string;
  user: User;
}

interface UserContextType {
  isAuthenticated: boolean;
  user: User | null;
  checkSession: () => Promise<void>;
  login: (roomNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (roomNumber: string, password: string) => {
    try {
      const response = await axiosInstance.post<LoginResponse>(
        '/user/login',
        { roomNumber, password },
        { withCredentials: true }
      );
      if (response.data.status) {
        const { username, roomNumber, email, isAdmin } = response.data.user;
        setUser({ username, roomNumber, email, isAdmin });
        setIsAuthenticated(true);
        toast.success(t('login.success'));
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      toast.error(t('login.failed'));
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/user/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      toast.info(t('logout.success'));
    } catch (error) {
      toast.error(t('logout.failed'));
    }
  };

  const checkSession = useCallback(async () => {
    try {
      const response = await axiosInstance.get('session-status', {
        withCredentials: true,
      });

      if (response.data.loggedIn) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      toast.error(t('session.failed'));
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [t]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <UserContext.Provider
      value={{
        isAuthenticated,
        user,
        checkSession,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
