import { Button, Dialog, Portal, Text } from "react-native-paper";

export default function ErrorDialog({ content, visible, onHide }) {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={onHide}
        style={{ backgroundColor: "white" }}
      >
        <Dialog.Title style={{ fontWeight: "bold" }}>Error!</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">{content}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onHide} labelStyle={{ color: "#F24E1E" }}>
            Dismiss
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
