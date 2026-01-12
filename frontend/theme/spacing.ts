// theme/spacing.ts
import { Platform, StatusBar } from 'react-native';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

// Encoche/barre de statut
export const NOTCH_HEIGHT = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 0);
export const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0;

// Tailles standardisées
export const Sizes = {
  navbarHeight: 56,
  tabBarHeight: 64,
  buttonHeight: 48,
  inputHeight: 48,
  iconSize: 24,
};