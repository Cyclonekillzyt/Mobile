import { View } from "react-native";
import FavoriteBtn from "./FavoriteBtn";
import BackButton from "./BackButton";
const PlayerHeader = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
        padding: 16,
        alignContent: "center",
      }}
    >
      <BackButton />
      <FavoriteBtn />
    </View>
  );
};

export default PlayerHeader;
