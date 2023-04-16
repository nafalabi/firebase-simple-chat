import PhotoIcon from "@heroicons/react/24/solid/PhotoIcon";
import PaperAirplaneIcon from "@heroicons/react/24/solid/PaperAirplaneIcon";
import { motion } from "framer-motion";
import FirestoreUtil from "../libs/firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../libs/firebase/main";
import { ChangeEvent, useRef } from "react";

const schema = z.object({
  message: z.string(),
});

const defaultValues = {
  message: "",
};

const ChatInput = () => {
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
    const file = files[0];
    await FirestoreUtil.addChatImage(file);
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
          disabled={!user}
          onClick={() => fileRef.current?.click()}
        >
          <PhotoIcon className="text-white h-6 w-6" />
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
