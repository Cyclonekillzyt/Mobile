import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useTheme";
import { usePlayerControls } from "@/hooks/usePlayerControls";

const SongControls = () => {
  const theme = useTheme();

  const {
    song,
    isPlaying,
    isLoading,
    handleStop,
    handleToggle,
    progress,
    duration,
  } = usePlayerControls();

  if (!song) return null;

  if (isLoading) {
    return <Text style={{ color: theme.text }}>Loading audio...</Text>;
  }

  const percent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <View style={{ alignItems: "center", paddingBottom: 30 }}>
      <View
        style={{
          height: 4,
          width: "80%",
          backgroundColor: theme.border,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <View
          style={{
            height: 4,
            width: `${percent}%`,
            backgroundColor: theme.primary,
            borderRadius: 10,
          }}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 30, alignItems: "center" }}>
        <TouchableOpacity onPress={handleStop}>
          <Ionicons name="stop" size={28} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleToggle}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={42}
            color={theme.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SongControls;
