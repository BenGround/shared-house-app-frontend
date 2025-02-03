import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from 'src/settings/axiosInstance';
import { SharedSpace } from 'src/types/sharedSpace';
import { handleError } from 'src/utils/errorHandler';
import { useUser } from './userContext';
import { loadToast } from 'src/utils/imports';
import { useTranslation } from 'react-i18next';

interface ShareSpacesContextType {
  updateSharedSpaces(shareSpaces: SharedSpace[]): void;
  sharedSpaces: SharedSpace[];
  isLoading: boolean;
  error: string | null;
  done: boolean;
  updateSharedSpacePicture: (file: File, id: number) => Promise<boolean>;
  removeSharedSpacePicture: (id: number) => Promise<boolean>;
}

const ShareSpacesContext = createContext<ShareSpacesContextType | undefined>(
  undefined
);

export const useSharedSpaces = () => {
  const context = useContext(ShareSpacesContext);
  if (!context) {
    throw new Error('useShareSpaces must be used within a ShareSpacesProvider');
  }
  return context;
};

const ShareSpacesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const { isAuthenticated } = useUser();
  const [sharedSpaces, setSharedSpaces] = useState<SharedSpace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<boolean>(false);

  const updateSharedSpaces = (sharedSpaces: SharedSpace[]) =>
    setSharedSpaces(sharedSpaces);

  const fetchShareSpaces = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await axiosInstance.get('sharedspace/list', {
        withCredentials: true,
      });
      setSharedSpaces(response.data);
    } catch (error) {
      setError(handleError(error));
    } finally {
      setIsLoading(false);
      setDone(true);
    }
  };

  const updateSharedSpacePicture = async (
    file: File,
    id: number
  ): Promise<boolean> => {
    if (!file) return false;

    const formData = new FormData();
    formData.append('picture', file);

    try {
      const response = await axiosInstance.put(
        `/admin/sharedspace/update/picture/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setSharedSpaces((sharedSpaces) => {
          return sharedSpaces.map((sharedspace) => {
            if (sharedspace.id === id) {
              return {
                ...sharedspace,
                picture: response.data?.picture,
              };
            }
            return sharedspace;
          });
        });
        const toast = await loadToast();
        toast.success(t('update.success'));
        return true;
      }
    } catch (error) {
      const toast = await loadToast();
      toast.error(t('update.failed'));
    }

    return false;
  };

  const removeSharedSpacePicture = async (id: number): Promise<boolean> => {
    try {
      const response = await axiosInstance.put(
        `/admin/sharedspace/delete/picture/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 204) {
        setSharedSpaces((sharedSpaces) => {
          return sharedSpaces.map((sharedspace) => {
            if (sharedspace.id === id) {
              return {
                ...sharedspace,
                picture: undefined,
              };
            }
            return sharedspace;
          });
        });
        const toast = await loadToast();
        toast.success(t('update.success'));
        return true;
      }
    } catch (error) {
      const toast = await loadToast();
      toast.error(t('update.failed'));
    }

    return false;
  };

  useEffect(() => {
    if (isAuthenticated && !done) fetchShareSpaces();
  }, [isAuthenticated]);

  return (
    <ShareSpacesContext.Provider
      value={{
        updateSharedSpaces,
        updateSharedSpacePicture,
        removeSharedSpacePicture,
        sharedSpaces,
        isLoading,
        error,
        done,
      }}
    >
      {children}
    </ShareSpacesContext.Provider>
  );
};

export default ShareSpacesProvider;
