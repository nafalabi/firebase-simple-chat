import PhotoIcon from "@heroicons/react/24/solid/PhotoIcon";
import PaperAirplaneIcon from "@heroicons/react/24/solid/PaperAirplaneIcon";
import { motion } from "framer-motion";
import FirestoreUtil from "../libs/firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../libs/firebase/main";
import { ChangeEvent, useRef, useState } from "react";

const schema = z.object({
  message: z.string().min(1),
});

const defaultValues = {
  message: "",
};

const ChatInput = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [user] = useAuthState(auth);
  const { register, handleSubmit, resetField } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const fileRef = useRef<HTMLInputElement>(null);

  const handleAddChatMessage = async (data: typeof schema._output) => {
    try {
      await FirestoreUtil.addChatMessage(data.message);
    } catch (error) {
      /** TODO: implement error handling  */
      console.log(error)
    } finally {
      resetField("message");
    }
  }

  const handleAddChatImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (files?.length < 1) return;
    setIsUploading(true);
    const file = files[0];
    await FirestoreUtil.addChatImage(file);
    setIsUploading(false);
    e.target.value = "";
    e.target.files = null;
  }

  return (
    <form
      onSubmit={handleSubmit(
        (data, event) => {
          event?.preventDefault();
          handleAddChatMessage(data);
        },
        (err) => {
          console.log("Error submit", err);
        }
      )}
      autoComplete="off"
    >
      <section className="flex gap-x-2 mt-4">
        <input
          type="file"
          className="hidden"
          ref={fileRef}
          onChange={handleAddChatImage}
        />
        <motion.button
          type="button"
          className="bg-slate-700 rounded-md px-2 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.8 }}
          disabled={!user || isUploading}
          onClick={() => fileRef.current?.click()}
        >
          {isUploading ? (
            <div role="status">
              <svg aria-hidden="true" className="w-6 h-6 text-slate-500 animate-spin dark:text-gray-600 fill-slate-200" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <PhotoIcon className="text-white h-6 w-6" />
          )}
        </motion.button>
        <motion.input
          {...register("message")}
          className="bg-slate-700 text-white px-3 py-2 rounded-md outline-none disabled:cursor-not-allowed w-full"
          whileTap={{ translateY: -5 }}
          disabled={!user}
          placeholder={user ? "Type a message here.." : "Please login to send a message"}
        />
        <motion.button
          type="submit"
          className="bg-slate-700 rounded-md px-2 disabled:cursor-not-allowed"
          whileTap={{ scale: 0.8 }}
          disabled={!user}
        >
          <PaperAirplaneIcon className="text-white h-6 w-6" />
        </motion.button>
      </section>
    </form>
  );
};

export default ChatInput;
