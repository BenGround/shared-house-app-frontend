import React from 'react';
import { ClipLoader } from 'react-spinners';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  translationKey?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ translationKey }) => {
  const { t } = useTranslation();

  return (
    <div style={{ textAlign: 'center', marginTop: '25vh' }}>
      <ClipLoader color="#007bff" size={50} />
      {translationKey && <p>{t(translationKey)}</p>}
    </div>
  );
};

export default LoadingSpinner;
