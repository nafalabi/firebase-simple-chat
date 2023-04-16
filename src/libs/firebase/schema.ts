import { FirestoreDataConverter, Timestamp } from "firebase/firestore";
import { z } from "zod";

export const chatMessageSchema = z.object({
  id: z.string(),
  uid: z.string(),
  uname: z.string(),
  upicture: z.string().nullable(),
  message: z.string().nullable(),
  chatpic: z.string().nullable(),
  createdAt: z.number().nullable(),
});

export type ChatMessageDocument = typeof chatMessageSchema._output;

export const chatMessageConverter: FirestoreDataConverter<ChatMessageDocument> =
  {
    toFirestore({ uid, uname, upicture, chatpic, message, createdAt }) {
      return {
        uid,
        uname,
        upicture,
        chatpic,
        message,
        createdAt,
      };
    },
    fromFirestore(snapshot, options) {
      const {id} = snapshot;
      const {
        uid,
        uname,
        upicture,
        chatpic,
        message,
        createdAt,
      } = snapshot.data(options) as Omit<ChatMessageDocument, "createdAt"> & { createdAt: Timestamp };

      return {
        id,
        uid,
        uname,
        upicture,
        chatpic,
        message,
        createdAt: createdAt?.toMillis(),
      }
    },
  };
