import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useUser } from 'src/contexts/userContext';
import { DashboardContent } from 'src/layouts/dashboard';
import { DASHBOARD_IMG } from 'src/utils/imgUtils';

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
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {t('welcomeback', { name: user?.username })}
        </Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          height: { xs: 350, md: 495 },
          backgroundImage: `url('${DASHBOARD_IMG}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 3, md: 5 },
          textAlign: 'center',
          color: 'white',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.4)',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.4)',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
          }}
        >
          {t('sharehouse.name')}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 300 }}>
          {t('web.application')}
        </Typography>
      </Box>
    </DashboardContent>
  );
};

export default Main;
