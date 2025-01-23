import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from 'src/settings/axiosInstance';
import { SharedSpace } from 'src/types/sharedSpace';
import { handleError } from 'src/utils/errorHandler';

interface ShareSpacesContextType {
  sharedSpaces: SharedSpace[];
  isLoading: boolean;
  error: string | null;
  fetchSharePlaces: () => void;
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

export const ShareSpacesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sharedSpaces, setSharedSpaces] = useState<SharedSpace[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchShareSpaces = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get('sharedspace/list');
      setSharedSpaces(response.data);
    } catch (error) {
      setError(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShareSpaces();
  }, []);

  return (
    <ShareSpacesContext.Provider
      value={{
        sharedSpaces,
        isLoading,
        error,
        fetchSharePlaces: fetchShareSpaces,
      }}
    >
      {children}
    </ShareSpacesContext.Provider>
  );
};
