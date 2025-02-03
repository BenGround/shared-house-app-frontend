import type { Breakpoint } from '@mui/material/styles';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from '../../routes/hooks';
import { RouterLink } from '../../routes/components';

import { varAlpha } from '../../theme/styles';

import { Scrollbar } from '../../components/scrollbar';
import { useTranslation } from 'react-i18next';
import { Divider, Typography } from '@mui/material';
import { useUser } from 'src/contexts/userContext';
import { OAKHOUSE_LOGO } from 'src/utils/imgUtils';
import { Iconify } from 'src/components/iconify';

export type NavContentProps = {
  data: {
    path: string;
    titleCode: string;
    iconName: string;
    info?: React.ReactNode;
    admin?: boolean;
    inDev?: boolean;
  }[];
  onNavItemClick?: () => void;
};

export function NavDesktop({
  data,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        paddingTop: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(
          theme.vars.palette.grey['500Channel'],
          0.12
        )})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
      }}
    >
      <NavContent data={data} />
    </Box>
  );
}

export function NavMobile({
  data,
  open,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
        },
      }}
    >
      <NavContent data={data} onNavItemClick={onClose} />
    </Drawer>
  );
}

export function NavContent({ data, onNavItemClick }: NavContentProps) {
  const { t } = useTranslation();
  const { user } = useUser();
  const pathname = usePathname();

  if (!user?.isAdmin) {
    data = data.filter((navItem) => !navItem.admin);
  }

  return (
    <>
      <Scrollbar fillContent>
        <Box
          component="nav"
          display="flex"
          flex="1 1 auto"
          flexDirection="column"
        >
          <Box
            component="ul"
            gap={1}
            display="flex"
            flexDirection="column"
            sx={{ paddingInlineStart: 0 }}
          >
            <img
              src={OAKHOUSE_LOGO}
              alt="logo"
              style={{
                width: 200,
                margin: 'auto',
                paddingTop: 30,
                paddingBottom: 30,
              }}
            />
            <Divider />
            {data.map((item) => {
              const isActive = item.path === `/${pathname.split('/')[1]}`;
              return (
                <ListItem disableGutters disablePadding key={item.titleCode}>
                  <ListItemButton
                    disableGutters
                    disabled={item.inDev}
                    component={RouterLink}
                    href={item.path}
                    onClick={onNavItemClick}
                    sx={{
                      pl: 2,
                      py: 1.5,
                      gap: 3,
                      pr: 1.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      fontWeight: 'fontWeightMedium',
                      color: 'var(--layout-nav-item-color)',
                      minHeight: 'var(--layout-nav-item-height)',
                      display: 'flex',
                      alignItems: 'center',
                      ...(isActive && {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: 'var(--layout-nav-item-active-bg)',
                        color: 'var(--layout-nav-item-active-color)',
                        '&:hover': {
                          bgcolor: 'var(--layout-nav-item-hover-bg)',
                        },
                      }),
                    }}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      flexGrow={1}
                    >
                      <Iconify icon={item.iconName} width={20} height={20} />{' '}
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isActive
                            ? 'fontWeightSemiBold'
                            : 'fontWeightMedium',
                        }}
                      >
                        {t(item.titleCode)}
                      </Typography>
                      {item.inDev && (
                        <Typography variant="body2" color="warning.main">
                          🚧
                        </Typography>
                      )}
                      {item.admin && (
                        <Typography variant="body2" color="warning.main">
                          🛡️
                        </Typography>
                      )}
                    </Box>

                    {item.info && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          ml: 2,
                        }}
                      >
                        {item.info}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>
    </>
  );
}
