import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/routes/components';
import { SimpleLayout } from 'src/layouts/simple';
import { useTranslation } from 'react-i18next';

const NotFound: React.FC = () => {
  return <NotFoundView />;
};

export function NotFoundView() {
  const { t } = useTranslation();

  return (
    <SimpleLayout content={{ compact: true }}>
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
    </SimpleLayout>
  );
}

export default NotFound;
