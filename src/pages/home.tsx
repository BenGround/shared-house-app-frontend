import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { useTranslation } from 'react-i18next';
import { Main } from 'src/sections/home';

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title> {`${t('home')} - ${CONFIG.appName}`}</title>
      </Helmet>

      <Main />
    </>
  );
}
