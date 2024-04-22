import { Redirect } from "expo-router";
//This is the root file
export default function Index() {
  return <Redirect href={"/content"} />;
}
