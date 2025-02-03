import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { stylesMode } from '../../theme/styles';

import Box from '@mui/material/Box';
import { Main } from './main';
import { HeaderSection } from '../core/headerSection';
import { LayoutSection } from '../core/layoutSection';
import { LanguagePopover } from '../components/languagePopover';
import { _langs } from 'src/data';

export type AuthLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function AuthLayout({ sx, children, header }: AuthLayoutProps) {
  const layoutQuery: Breakpoint = 'md';

  return (
    <LayoutSection
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: { maxWidth: false },
            toolbar: {
              sx: { bgcolor: 'transparent', backdropFilter: 'unset' },
            },
          }}
          sx={{
            position: { [layoutQuery]: 'fixed' },

            ...header?.sx,
          }}
          slots={{
            rightArea: (
              <Box gap={1} display="flex" alignItems="center">
                <LanguagePopover data={_langs} />
              </Box>
            ),
          }}
        />
      }
      footerSection={null}
      cssVars={{ '--layout-auth-content-width': '420px' }}
      sx={{
        '&::before': {
          width: 1,
          height: 1,
          zIndex: -1,
          content: "''",
          opacity: 0.24,
          position: 'fixed',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          [stylesMode.dark]: { opacity: 0.08 },
        },
        ...sx,
      }}
    >
      <Main layoutQuery={layoutQuery}>{children}</Main>
    </LayoutSection>
  );
}
