// components/layout/Container.tsx
import { useAppTheme } from "@/hooks/use-app-theme";
import { BlurView } from "expo-blur";
import React from "react";
import { Modal as ModalNative, TouchableOpacity, View, ViewProps, ViewStyle } from "react-native";
import { IconSymbol } from "./icon-symbol";

interface ModalProps extends ViewProps {
  children: React.ReactNode;
  withPaddingTop?: boolean;
  withPadding?: boolean;
  fullscreen?: boolean;
  visible: boolean;
  horizontalMargin: number;
  hideModal: () => void;
}

export default function Modal({
  children,
  style,
  fullscreen = false,
  withPaddingTop = true,
  withPadding = false,
  visible,
  horizontalMargin,
  hideModal,
  ...props
}: ModalProps) {
  const theme = useAppTheme();

  const modalStyle: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: fullscreen ? theme.notchHeight : withPaddingTop ? theme.spacing.md : 0,
    paddingHorizontal: withPadding ? theme.spacing.md : 0,
    position: "absolute",
    height: "auto",
    top: fullscreen ? 0 : 128,
    bottom: fullscreen ? 0 : 128,
    left: fullscreen ? 0 : theme.spacing.md,
    right: fullscreen ? 0 : theme.spacing.md,
    padding: theme.spacing.md,
    borderRadius: fullscreen ? 0 : 20,
  };

  return (
    <ModalNative
      visible={visible}
      transparent={true}
      animationType="slide"
      {...props}
    >
      <View 
        style={[modalStyle, style]}      
      >
        {children}
      </View>
        <BlurView
        tint="dark"
        intensity={20}
          style={{
            height: 60,
            position: "absolute",
            bottom: horizontalMargin,
            left: horizontalMargin,
            // backgroundColor: "#222",
            borderColor: "#888",
            borderWidth: 1,
            borderRadius: 30,
            display: "flex",
            flexDirection: "row",
            overflow: "hidden"
          }}
        >
          <TouchableOpacity
            onPress={hideModal}
            style={{
              aspectRatio: "1/1",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <IconSymbol name="xmark" color="white" size={32} />
          </TouchableOpacity>
        </BlurView>
    </ModalNative>
  );
}
{/*  */}