import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config-global';
import { useTranslation } from 'react-i18next';
import { CreatePassword } from 'src/sections/createPassword';

export default function Page() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title> {`${t('create-password')} - ${CONFIG.appName}`}</title>
      </Helmet>

      <CreatePassword />
    </>
  );
}
