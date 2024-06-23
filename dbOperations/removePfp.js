import { deleteObject, getStorage, ref } from "firebase/storage";

async function removePfp(id) {
  const storage = getStorage();
  const storageRef = ref(storage, id);

  await deleteObject(storageRef);
}

export default removePfp;
