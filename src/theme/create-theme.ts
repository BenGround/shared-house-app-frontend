import { extendTheme } from '@mui/material/styles';
import { Theme } from '@mui/material/styles';
import {
  colorSchemes,
  shadows,
  customShadows,
  components,
  typography,
} from './core';
import { shouldSkipGeneratingVar } from './core/themeHelper';

export function createTheme(): Theme {
  const initialTheme = {
    colorSchemes,
    shadows: shadows(),
    customShadows: customShadows(),
    shape: { borderRadius: 8 },
    components,
    typography,
    cssVarPrefix: '',
    shouldSkipGeneratingVar,
  };

  const theme = extendTheme(initialTheme);

  return theme;
}
