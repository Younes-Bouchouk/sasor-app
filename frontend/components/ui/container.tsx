// components/layout/Container.tsx
import { useAppTheme } from '@/hooks/use-app-theme';
import React from 'react';
import { View, ViewProps } from 'react-native';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  withPaddingTop?: boolean;
  withPadding?: boolean;
}

export default function Container({
  children,
  style,
  withPaddingTop = true,
  withPadding = true,
  ...props
}: ContainerProps) {
  const theme = useAppTheme();
  
  const containerStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: withPaddingTop ? theme.notchHeight : 0,
    paddingHorizontal: withPadding ? theme.spacing.md : 0,
  };
  
  return (
    <View style={[containerStyle, style]} {...props}>
      {children}
    </View>
  );
}