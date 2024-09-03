import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useContext } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { themeColors } from "~/Constants";

const BottomSheetWrapper = forwardRef(
  (
    {
      children,
      closeFn = () => {},
      closeButtonText = "Close",
      preventDefaultClose = false,
    },
    ref,
  ) => {
    const insets = useContext(SafeAreaInsetsContext);
    return (
      <BottomSheetModal
        ref={ref}
        enableDynamicSizing
        backgroundStyle={{ backgroundColor: themeColors.background }}
        topInset={insets.top}
        keyboardBlurBehavior={"restore"}
        android_keyboardInputMode={"adjustResize"}
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
            if (!preventDefaultClose) {
              ref.current.close();
            }
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
            {closeButtonText}
          </Text>
        </Pressable>
        {children}
      </BottomSheetModal>
    );
  },
);

export default BottomSheetWrapper;
