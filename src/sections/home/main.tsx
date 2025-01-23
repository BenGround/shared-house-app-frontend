import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from 'src/contexts/userContext';
import { DashboardContent } from 'src/layouts/dashboard';

export const Main: React.FC = () => {
  const { user } = useUser();
  const { t } = useTranslation();

  return (
    <DashboardContent maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontSize: { xs: '1.5rem', md: '2rem' },
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
          }}
        >
          {t('welcomeback', { name: user?.username })}
        </Typography>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: 495,
          backgroundImage: `url('/assets/home.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 5,
          textAlign: 'center',
          color: 'white',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
          }}
        >
          {t('sharehouse.name')}
        </Typography>
        <Typography variant="h5">{t('web.application')}</Typography>
      </Box>
    </DashboardContent>
  );
};

export default Main;
