import { skipGlobalKeys, skipPaletteKeys } from './themeConstants';

export function shouldSkipGeneratingVar(
  keys: string[],
  value: string | number
): boolean {
  const isPaletteKey = keys[0] === 'palette';

  if (isPaletteKey) {
    const paletteType = keys[1];
    const skipKeys = skipPaletteKeys[paletteType] || skipPaletteKeys.global;
    return keys.some((key) => skipKeys?.includes(key));
  }

  return keys.some((key) => skipGlobalKeys?.includes(key));
}
