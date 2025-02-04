import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const isMobileWindows = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('sm'));
};

export const isTabletWindows = () => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
};
