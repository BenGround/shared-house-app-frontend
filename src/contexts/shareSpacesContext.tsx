import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from 'src/settings/axiosInstance';
import { SharedSpace } from 'src/types/sharedSpace';
import { handleError } from 'src/utils/errorHandler';
import { useUser } from './userContext';

interface ShareSpacesContextType {
  updateSharedSpaces(shareSpaces: SharedSpace[]): void;
  sharedSpaces: SharedSpace[];
  isLoading: boolean;
  error: string | null;
  done: boolean;
}

const ShareSpacesContext = createContext<ShareSpacesContextType | undefined>(
  undefined
);

export const useShareSpaces = () => {
  const context = useContext(ShareSpacesContext);
  if (!context) {
    throw new Error('useShareSpaces must be used within a ShareSpacesProvider');
  }
  return context;
};

const ShareSpacesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

  useEffect(() => {
    if (isAuthenticated && !done) fetchShareSpaces();
  }, [isAuthenticated]);

  return (
    <ShareSpacesContext.Provider
      value={{
        updateSharedSpaces,
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
