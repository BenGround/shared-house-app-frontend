import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { UserView } from '../sections/user/view';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title> {`${t('users')} - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserView />
    </>
  );
}
