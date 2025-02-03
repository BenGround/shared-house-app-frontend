import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/routes/components';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

const NotFound: React.FC = () => {
  return <NotFoundView />;
};

export function NotFoundView() {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {t('404.page.not.found')}
        </Typography>

        <Typography sx={{ color: 'text.secondary', mb: 4 }}>
          {t('404.page.not.found.description')}
        </Typography>

        <Button
          component={RouterLink}
          href="/"
          size="large"
          variant="contained"
          color="primary"
          sx={{ textTransform: 'none' }}
          aria-label={t('go.to.home')}
        >
          {t('go.to.home')}
        </Button>
      </Container>
    </Box>
  );
}

export default NotFound;
