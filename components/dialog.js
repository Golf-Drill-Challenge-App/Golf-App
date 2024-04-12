import { Button, Dialog, Portal, Text } from "react-native-paper";

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
  title,
  content,
  visible,
  onHide,
  buttons,
  buttonsFunctions,
}) {
  const Buttons = buttons.map((item, index) => {
    let style;
    let labelStyle;
    if (index == 0) {
      style = {};
      labelStyle = { color: "#F24E1E" };
    } else {
      style = { backgroundColor: "#F24E1E" };
      labelStyle = { color: "white" };
    }

    return (
      <Button
        key={index}
        onPress={buttonsFunctions[index]}
        style={style}
        labelStyle={labelStyle}
      >
        {item}
      </Button>
    );
  });

  return (
    <Portal>
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
    </Portal>
  );
}
