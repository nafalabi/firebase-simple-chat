import imageCompression, { Options } from "browser-image-compression";
import { User } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./main";

export namespace StorageUtil {
  export const createChatImageStorageRef = (uid: User['uid'], fileid: string) => {
    const path = `chatimg/${uid}/${fileid}`;
    const imgRef = ref(storage, path);
    return imgRef;
  };

  export const compressImage = async (imageFile: File) => {
    const compressionOption: Options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };
    const compressedImage = await imageCompression(imageFile, compressionOption);
    return compressedImage;
  };

  export const uploadChatImage = async (imageFile: File, uid: User['uid'], fileid: string) => {
    const imgRef = createChatImageStorageRef(uid, fileid);
    const compressedImage = await compressImage(imageFile);
    await uploadBytesResumable(imgRef, compressedImage);
    const publicImageUrl = await getDownloadURL(imgRef);
    return publicImageUrl;
  };

};

