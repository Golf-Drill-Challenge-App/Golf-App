import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useContext } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";

const BottomSheetWrapper = forwardRef(
  ({ children, closeFn = () => {} }, ref) => {
    const insets = useContext(SafeAreaInsetsContext);
    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        backgroundStyle={{ backgroundColor: themeColors.background }}
        topInset={insets.top}
        keyboardBlurBehavior={"restore"}
        backdropComponent={({ animatedIndex, style }) => {
          return (
            <BottomSheetBackdrop
              appearsOnIndex={0}
              disappearsOnIndex={-1}
              animatedIndex={animatedIndex}
              style={[style, { top: -insets.top }]}
            />
          );
        }}
      >
        {/* Close Button */}
        <Pressable
          onPress={() => {
            console.log("ref.current");
            ref.current.close();
            closeFn();
          }}
        >
          <Text
            style={{
              color: themeColors.accent,
              fontSize: 17,
              marginLeft: 10,
            }}
          >
            Close
          </Text>
        </Pressable>
        {children}
      </BottomSheetModal>
    );
  },
);

export default BottomSheetWrapper;
