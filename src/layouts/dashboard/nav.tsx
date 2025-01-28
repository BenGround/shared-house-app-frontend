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
import { Divider } from '@mui/material';
import { useUser } from 'src/contexts/userContext';

export type NavContentProps = {
  data: {
    path: string;
    titleCode: string;
    info?: React.ReactNode;
    admin?: boolean;
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
              src="https://www.oakhouse.jp/assets/img/logo.png"
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
              const isActived = item.path === `/${pathname.split('/')[1]}`;
              return (
                <ListItem disableGutters disablePadding key={item.titleCode}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    onClick={onNavItemClick} // This will work if onNavItemClick is passed, else it will be ignored
                    sx={{
                      pl: 2,
                      py: 1,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      fontWeight: 'fontWeightMedium',
                      color: 'var(--layout-nav-item-color)',
                      minHeight: 'var(--layout-nav-item-height)',
                      ...(isActived && {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: 'var(--layout-nav-item-active-bg)',
                        color: 'var(--layout-nav-item-active-color)',
                        '&:hover': {
                          bgcolor: 'var(--layout-nav-item-hover-bg)',
                        },
                      }),
                    }}
                  >
                    <Box component="span" flexGrow={1}>
                      {t(item.titleCode)}
                    </Box>

                    {item.info && item.info}
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
