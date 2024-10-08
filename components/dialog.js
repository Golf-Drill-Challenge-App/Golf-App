import { Button, Dialog, Portal, Snackbar, Text } from "react-native-paper";
import { themeColors } from "~/Constants";

/**
 * PROPS
 * title - title to be displayed on the dialog
 * content - main text to be displayed on the dialog
 * visible - from useState Hook for this Dialog
 * onHide - function to set useState Hook to false
 * buttons - an array of strings for the buttons to be displayed
 * buttonsFunctions - an array of functions for the buttons to be displayed
 */
export default function DialogComponent({
  type,
  title,
  content,
  visible,
  onHide,
  buttons = [{ children: "Ok", pressHandler: () => onHide(), loading: false }], //should I also include style in here?
}) {
  const Buttons = buttons.map((button, index) => {
    let style;
    let labelStyle;
    if (index === 0) {
      style = {};
      labelStyle = { color: themeColors.accent };
    } else {
      style = { backgroundColor: themeColors.accent };
      labelStyle = { color: themeColors.highlight };
    }

    return (
      <Button
        key={index}
        onPress={button["pressHandler"]}
        style={style}
        labelStyle={labelStyle}
        loading={!!button["loading"]}
      >
        {button["children"]}
      </Button>
    );
  });

  return (
    <Portal>
      {type === "snackbar" ? (
        <Snackbar
          visible={visible}
          onDismiss={onHide}
          theme={{
            colors: {
              inversePrimary: themeColors.accent,
              inverseSurface: themeColors.highlight,
              inverseOnSurface: "black",
              surface: "black",
            },
          }}
          action={{
            label: "Dismiss",
            onPress: onHide,
          }}
        >
          {content}
        </Snackbar>
      ) : (
        <Dialog
          visible={visible}
          onDismiss={onHide}
          style={{ backgroundColor: "white" }}
        >
          <Dialog.Title style={{ fontWeight: "bold" }}>{title}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{content}</Text>
          </Dialog.Content>
          <Dialog.Actions>{Buttons}</Dialog.Actions>
        </Dialog>
      )}
    </Portal>
  );
}
