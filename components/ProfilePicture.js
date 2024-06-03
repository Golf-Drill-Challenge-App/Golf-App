import { Image } from "react-native-expo-image-cache";
import { Avatar } from "react-native-paper";
import { themeColors } from "~/Constants";
import { getInitials } from "~/Utility";

function ProfilePicture({ style, userInfo }) {
  if (!userInfo) return null;
  if (userInfo.pfp) {
    return <Image uri={userInfo.pfp} style={style} />;
  } else {
    return (
      <Avatar.Text
        size={Math.min(style.width, style.height)}
        label={getInitials(userInfo.name)}
        color="white"
        style={[{ backgroundColor: themeColors.avatar }, style]}
      />
    );
  }
}

export default ProfilePicture;
