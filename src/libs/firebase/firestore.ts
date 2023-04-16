import {
  collection,
  addDoc,
  query,
  orderBy,
  limitToLast,
  serverTimestamp,
  getCountFromServer,
  updateDoc,
} from 'firebase/firestore'
import { auth, db } from './main';
import { chatMessageConverter, ChatMessageDocument } from './schema';
import { StorageUtil } from './storage';

namespace FirestoreUtil {

  export const CHAT_MESSAGE_REF = collection(db, 'chat');

  export const queryMessages = (limit: number = 10) => {
    return query(
      CHAT_MESSAGE_REF,
      orderBy('createdAt', 'asc'),
      limitToLast(limit),
    ).withConverter(chatMessageConverter);
  };

  export const countTotalMessages = async () => {
    const q = query(CHAT_MESSAGE_REF);
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    return count;
  };

  export const addChatMessage = async (text?: string) => {
    const userData = auth.currentUser;
    if (!userData) throw new Error("You have to login to send the chat!");

    const payload: Omit<ChatMessageDocument, "id"> = {
      uid: userData.uid,
      uname: userData.displayName ?? "Anonymous",
      upicture: userData.photoURL,
      message: text ?? null,
      chatpic: null,
      createdAt: serverTimestamp() as unknown as number,
    };

    return await addDoc(CHAT_MESSAGE_REF, payload);
  };

  export const addChatImage = async (imageFile: File) => {
    const userData = auth.currentUser;
    if (!userData) throw new Error("You have to login to send image!");

    const chatData = await addChatMessage();
    const chatId = chatData.id;
    const publicImageUrl = await StorageUtil.uploadChatImage(imageFile, userData.uid, chatId);

    await updateDoc(chatData, {
      chatpic: publicImageUrl,
    } as Partial<ChatMessageDocument>);
  };
};

export default FirestoreUtil;

