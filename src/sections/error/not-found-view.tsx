import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/routes/components';
import { SimpleLayout } from 'src/layouts/simple';
import { useTranslation } from 'react-i18next';

export function NotFoundView() {
  const { t } = useTranslation();

  return (
    <SimpleLayout content={{ compact: true }}>
      <Container>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {t('404.page.not.found')}
        </Typography>

        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          {t('404.page.not.found.description')}
        </Typography>

        <Button
          component={RouterLink}
          href="/"
          size="large"
          variant="contained"
          color="inherit"
        >
          {t('go.to.home')}
        </Button>
      </Container>
    </SimpleLayout>
  );
}
