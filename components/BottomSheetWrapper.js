import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { forwardRef, useContext } from "react";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";

const BottomSheetWrapper = forwardRef(({ children }, ref) => {
  const insets = useContext(SafeAreaInsetsContext);
  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      keyboardBehavior={"interactive"}
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
      {children}
    </BottomSheetModal>
  );
});

export default BottomSheetWrapper;
