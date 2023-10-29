import { StyleSheet } from "react-native";
import { Pressable, Text } from "./Themed";
import { Link } from "expo-router";

type Props = {
  name: string;
  description: string;
  href: string;
};

export default function DrillListItem(props: Props) {
  const { name, description, href } = props;

  return (
    <Link href={href} asChild>
      <Pressable style={styles.container}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.desc}>{description}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },
  title: {
    fontFamily: "Karma",
    fontSize: 24,
  },
  desc: {
    fontSize: 16,
  },
});
