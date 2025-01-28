export const skipGlobalKeys = [
  'mixins',
  'overlays',
  'direction',
  'typography',
  'breakpoints',
  'transitions',
  'cssVarPrefix',
  'unstable_sxConfig',
];

export const skipPaletteKeys: { [key: string]: string[] } = {
  global: ['tonalOffset', 'dividerChannel', 'contrastThreshold'],
  grey: ['A100', 'A200', 'A400', 'A700'],
  text: ['icon'],
};
