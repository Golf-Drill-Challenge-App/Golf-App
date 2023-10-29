import { FC } from "react";
import { Pressable, PressableProps } from "./Themed";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

const PageButton: FC<PressableProps> = ({ style, ...otherProps }) => {
  return (
    <Pressable
      style={[style, styles.pageButton] as StyleProp<ViewStyle>}
      {...otherProps}
    />
  );
};

const styles = StyleSheet.create({
  pageButton: {
    borderWidth: 0.5,
    borderRadius: 10,
    margin: 10,
    paddingVertical: 20,
    width: 300,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default PageButton;
