// hooks/useAppTheme.ts
// import { NOTCH_HEIGHT, Radius, Spacing, Typography } from '@/theme';
import { NOTCH_HEIGHT, Radius, Spacing } from '@/theme/spacing';
import { Typography } from '@/theme/typography';
import { useThemeColor } from './use-theme-color';

export function useAppTheme() {
  // Récupère toutes les couleurs
  const colors = {
    background: useThemeColor({}, 'background'),
    text: useThemeColor({}, 'text'),
    // primary: useThemeColor({}, 'primary'),
    // surface: useThemeColor({}, 'surface'),
    // border: useThemeColor({}, 'border'),
    // Ajoute toutes les couleurs dont tu as besoin
  };
  
  return {
    colors,
    spacing: Spacing,
    radius: Radius,
    typography: Typography,
    notchHeight: NOTCH_HEIGHT,
  };
}