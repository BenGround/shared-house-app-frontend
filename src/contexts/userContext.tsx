import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from 'src/settings/axiosInstance';
import { handleError } from 'src/utils/errorHandler';
import { loadToast } from 'src/utils/imports';

interface User {
  username: string | undefined;
  roomNumber: string;
  email: string;
  isAdmin: boolean;
  profilePicture: string | undefined;
}

interface UserContextType {
  authCallDone: boolean;
  isAuthenticated: boolean;
  user: User | null;
  login: (roomNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (username: string) => Promise<void>;
  updateUserPicture: (file: File) => Promise<boolean>;
  removeUserPicture: () => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const [authCallDone, setAuthCallDone] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = async (roomNumber: string, password: string) => {
    try {
      const response = await axiosInstance.post(
        '/user/login',
        {
          roomNumber,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.data) {
        const { username, roomNumber, email, isAdmin, profilePicture } =
          response.data.data;
        setUser({ username, roomNumber, email, isAdmin, profilePicture });
        setIsAuthenticated(true);
        const toast = await loadToast();
        toast.success(t('login.success'));
      } else {
        throw new Error(response.data.message);
      }

      setAuthCallDone(true);
    } catch (error) {
      handleError(error);
    }
  };

  const logout = async () => {
    try {
      await axiosInstance.post('/user/logout', {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      const toast = await loadToast();
      toast.info(t('logout.success'));
    } catch (error) {
      const toast = await loadToast();
      toast.error(t('logout.failed'));
    }
  };

  const checkSession = useCallback(async () => {
    try {
      const response = await axiosInstance.get('user/session-status', {
        withCredentials: true,
      });

      if (response.data.data) {
        setUser(response.data.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      handleError(error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setAuthCallDone(true);
    }
  }, [t]);

  const updateUser = async (username: string) => {
    if (!username) {
      const toast = await loadToast();
      toast.error(t('update.noFields'));
      return;
    }

    try {
      const response = await axiosInstance.put(
        '/user/update',
        { username },
        { withCredentials: true }
      );
      if (response.status === 204) {
        setUser((prevUser) => ({ ...prevUser!, username }));
        const toast = await loadToast();
        toast.success(t('update.success'));
      } else {
        throw new Error();
      }
    } catch {
      const toast = await loadToast();
      toast.error(t('update.failed'));
    }
  };

  const updateUserPicture = async (file: File): Promise<boolean> => {
    if (!file) return false;

    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await axiosInstance.put(
        '/user/update/picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setUser((prevUser) => ({
          ...prevUser!,
          profilePicture: response.data.data,
        }));
        const toast = await loadToast();
        toast.success(t('update.success'));
        return true;
      } else {
        throw new Error();
      }
    } catch (error) {
      const toast = await loadToast();
      toast.error(t('update.failed'));
    }

    return false;
  };

  const removeUserPicture = async (): Promise<boolean> => {
    try {
      const response = await axiosInstance.put(
        '/user/delete/picture',
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 204) {
        setUser((prevUser) => ({
          ...prevUser!,
          profilePicture: undefined,
        }));
        const toast = await loadToast();
        toast.success(t('update.success'));
        return true;
      } else {
        throw new Error();
      }
    } catch (error) {
      const toast = await loadToast();
      toast.error(t('update.failed'));
    }

    return false;
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <UserContext.Provider
      value={{
        authCallDone,
        isAuthenticated,
        user,
        login,
        logout,
        updateUser,
        updateUserPicture,
        removeUserPicture,
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

export default UserProvider;
