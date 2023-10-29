import { ImageBackground, ImageSourcePropType } from "react-native";
import { Text } from "./Themed";

type Props = {
  title: string;
  imageUri: ImageSourcePropType;
};

export default function ScreenHeader({ title, imageUri }: Props) {
  return (
    <ImageBackground
      style={{ width: "100%", height: "20%", marginBottom: 10 }}
      imageStyle={{ width: "100%", height: "100%" }}
      source={imageUri}
    >
      <Text
        style={{
          position: "absolute",
          bottom: 0,
          left: 15,
          fontSize: 40,
          fontWeight: "bold",
          color: "white",
        }}
      >
        {title}
      </Text>
    </ImageBackground>
  );
}
