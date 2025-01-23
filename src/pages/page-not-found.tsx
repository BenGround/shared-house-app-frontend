import { Helmet } from 'react-helmet-async';
import { NotFoundView } from '../sections/error';
import { CONFIG } from 'src/config-global';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title> {`${t('pagenotfound')} - ${CONFIG.appName}`}</title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
