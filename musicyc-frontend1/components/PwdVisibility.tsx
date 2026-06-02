import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "@/hooks/useTheme";
import { ComponentProps } from "react";
import { useState } from "react";

type IconName = ComponentProps<typeof Ionicons>["name"];


type Props = {
  visible: boolean,
  onToggle: () => void
};

const PwdVisibility = ({visible, onToggle}: Props) => {
  const theme = useTheme()
  return (
   
    <Ionicons
      onPress={onToggle}
        name={visible ? "eye-off-outline" : "eye-outline"}
        size={20}
        color={theme.subtext}
      />

  );
}

export default PwdVisibility