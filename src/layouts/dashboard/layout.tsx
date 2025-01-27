import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import { _langs } from 'src/data';

import { Iconify } from 'src/components/iconify';

import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
import { navData } from '../config-nav-dashboard';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { AccountPopover } from '../components/account-popover';
import { LanguagePopover } from '../components/language-popover';
import { useTranslation } from 'react-i18next';
import { Divider } from '@mui/material';

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({
  sx,
  children,
  header,
}: DashboardLayoutProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [navOpen, setNavOpen] = useState(false);
  const layoutQuery: Breakpoint = 'lg';

  return (
    <LayoutSection
      headerSection={
        <Box sx={{ position: 'sticky', top: 0, zIndex: theme.zIndex.appBar }}>
          <HeaderSection
            layoutQuery={layoutQuery}
            slotProps={{
              container: {
                maxWidth: false,
                sx: { px: { [layoutQuery]: 5 } },
              },
            }}
            sx={header?.sx}
            slots={{
              leftArea: (
                <>
                  <MenuButton
                    onClick={() => setNavOpen(true)}
                    sx={{
                      ml: -1,
                      [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                    }}
                  />
                  <NavMobile
                    data={navData}
                    open={navOpen}
                    onClose={() => {
                      setNavOpen(false);
                    }}
                  />
                </>
              ),
              rightArea: (
                <Box gap={1} display="flex" alignItems="center">
                  <LanguagePopover data={_langs} />
                  <AccountPopover
                    data={[
                      {
                        label: t('account.popover.home'),
                        href: '/',
                        icon: (
                          <Iconify
                            width={22}
                            icon="solar:home-angle-bold-duotone"
                          />
                        ),
                      },
                      {
                        label: t('account.popover.profile'),
                        href: '/profile',
                        icon: (
                          <Iconify
                            width={22}
                            icon="solar:shield-keyhole-bold-duotone"
                          />
                        ),
                      },
                      /*{
                        label: t('account.popover.settings'),
                        href: '#',
                        icon: (
                          <Iconify
                            width={22}
                            icon="solar:settings-bold-duotone"
                          />
                        ),
                      },*/
                    ]}
                  />
                </Box>
              ),
            }}
          />
          <Divider />
        </Box>
      }
      sidebarSection={<NavDesktop data={navData} layoutQuery={layoutQuery} />}
      footerSection={null}
      cssVars={{
        '--layout-nav-vertical-width': '300px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main sx={{ paddingTop: '15px' }}>{children}</Main>
    </LayoutSection>
  );
}
