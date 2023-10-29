import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Text, View, useThemeColor } from "../../../components/Themed";
import { Link } from "expo-router";
import PageButton from "../../../components/PageButton";

const MenuOptions = [
  {
    href: "/Home/Drills",
    title: "Drills",
    icon: require("../../../assets/icons/practiceDrillsIcon.png"),
  },
  {
    href: "/Home/Leaderboard",
    title: "Leaderboard",
    icon: require("../../../assets/icons/leaderboardIcon.png"),
  },
  {
    href: "/Home/Progress",
    title: "Progress",
    icon: require("../../../assets/icons/progressIcon.png"),
  },
];

export default function Home() {
  const color = useThemeColor({ light: "transparent", dark: "white" }, "text");

  return (
    <View style={styles.container}>
      <Image
        style={styles.images}
        contentFit="contain"
        contentPosition="center"
        source={require("../../../assets/images/beaverLogo.png")}
      />
      <Image
        style={styles.images}
        contentFit="contain"
        contentPosition="center"
        source={require("../../../assets/images/OSUBlockLetters.png")}
      />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {MenuOptions.map(({ href, title, icon }, i) => (
        <Link href={href} key={i} asChild>
          <PageButton>
            <Image
              style={[styles.icons, { tintColor: color }]}
              contentFit="contain"
              contentPosition="center"
              source={icon}
            />
            <Text style={styles.buttonTitle}>{title}</Text>
          </PageButton>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  buttonTitle: {
    fontSize: 25,
  },
  images: {
    flex: 0.8,
    width: "40%",
    marginVertical: -100,
  },
  icons: {
    width: 40,
    height: 40,
    marginHorizontal: 30,
  },
});
