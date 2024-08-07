import { SaveFormat, manipulateAsync } from "expo-image-manipulator";
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import { updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const firebaseProfileImageUpload = async (
  uri,
  setImageUploading,
  showSnackBar,
  id,
  reference,
) => {
  try {
    setImageUploading(true);
    // Fetch the image data from the URI
    const response = await fetch(uri);
    const blob = await response.blob();

    // Get a reference to the Firebase Storage instance
    const storage = getStorage();

    // Create a reference to the storage location where the image will be stored
    const storageRef = ref(storage, id);

    // Upload the image to Firebase Storage
    const snapshot = await uploadBytes(storageRef, blob);

    console.log("Uploaded the image blob to the Firebase storage:", snapshot);

    // Get the download URL for the uploaded image
    const downloadURL = await getDownloadURL(snapshot.ref);
    await updateDoc(reference, {
      pfp: downloadURL,
    });

    showSnackBar("Successfully uploaded the profile picture!");
    setImageUploading(false);

    return downloadURL;
  } catch (e) {
    console.log("Error uploading image to Firebase:", e);
    showSnackBar("Error uploading profile picture. Please try again.");
    setImageUploading(false);

    throw e; // Rethrow the error to handle it at the caller's level if needed
  }
};

// Function to resize the uploaded image
const resizeImage = async (uri, width) => {
  const manipResult = await manipulateAsync(
    uri,
    [{ resize: { width: width } }], // Adjust the width as needed; height is adjusted automatically to maintain aspect ratio.
    { /*compress: 0.7,*/ format: SaveFormat.JPEG }, // Uncomment the 'compress' property in case we decide to further reduce the quality.
  );
  return manipResult.uri;
};

// Function to handle image upload
export const handleImageUpload = async (
  setImageUploading,
  showSnackBar,
  id,
  reference,
  width,
  height,
) => {
  const imageResult = await launchImageLibraryAsync({
    mediaTypes: MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [width, height],
    quality: 1,
  });

  // console.log(imageResult);

  if (!imageResult.canceled) {
    const resizedUri = await resizeImage(imageResult.assets[0].uri, width);
    await firebaseProfileImageUpload(
      resizedUri,
      setImageUploading,
      showSnackBar,
      id,
      reference,
    );
  }
};
