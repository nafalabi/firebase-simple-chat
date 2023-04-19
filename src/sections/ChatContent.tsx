import clsx from 'clsx';
import { format } from 'date-fns';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { AnimatePresence, motion } from 'framer-motion';
import ArrowTopRightOnSquareIcon from "@heroicons/react/24/solid/ArrowTopRightOnSquareIcon";
import FirestoreUtil from '../libs/firebase/firestore';
import { auth } from '../libs/firebase/main';
import { ChatMessageDocument } from '../libs/firebase/schema';
import { useEffect, useRef, useState } from 'react';
import useObserverIntersection from '../hooks/useObserverIntersection';
import Modal from '../components/Modal';

export type ChatMessageProps = {
  chatData: ChatMessageDocument;
  isItMine?: boolean;
  setSelectedImage: (imageUrl: string) => void;
}

const ChatMessage = ({ chatData, isItMine, setSelectedImage }: ChatMessageProps) => {
  const isInfoBot = chatData.uid === "info-bot";
  return (
    <motion.li
      id={chatData.id}
      className={clsx("flex gap-3", isItMine && "flex-row-reverse")}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, animationDelay: '0.5s' }}
      exit={{ opacity: 0 }}
    >
      <div className="rounded-full w-9 h-9 shrink-0 overflow-hidden">
        {!isInfoBot && (
          <img
            src={chatData.upicture ?? "/profilepic.jpeg"}
            className={clsx(
              "w-auto h-auto",
              !chatData.upicture && "bg-gray-100",
            )}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = '/profilepic.jpeg';
              currentTarget.classList.add('bg-gray-100');
            }}
          />
        )}
        {isInfoBot && (
          <div className="bg-gray-50/75 p-1">
            <img
              src="bot-icon-24.png"
              className="w-auto h-auto"
            />
          </div>
        )}
      </div>
      <div className="relative bg-slate-600 px-4 py-2 text-slate-300 rounded-lg max-w-md">
        <div className="flex items-center gap-x-2 flex-wrap">
          <p className="text-white font-medium">{chatData.uname}</p>
          <p className="text-slate-400 text-sm">{chatData.createdAt && format(chatData.createdAt, "d MMM yy, hh:mm a")}</p>
        </div>
        {chatData.message && (
          <p className="whitespace-pre-wrap">{chatData.message}</p>
        )}
        {chatData.chatpic && (
          <div className="flex items-center justify-center w-full bg-gray-300 rounded sm:w-96 dark:bg-gray-700 my-2 overflow-hidden cursor-pointer">
            <img
              src={chatData.chatpic}
              alt='chatimage'
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = '/imgplaceholder.svg';
                currentTarget.className = 'w-12 h-12 text-gray-200';
                currentTarget.parentElement?.classList.add('h-48');
              }}
              onClick={() => setSelectedImage(chatData.chatpic ?? "/imgplaceholder.svg")}
            />
          </div>
        )}
        {(!chatData.message && !chatData.chatpic) && (
          <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700 my-2">
            <img src="imgplaceholder.svg" className="w-12 h-12 text-gray-200"  />
          </div>
        )}
        <div className={clsx(
          "absolute top-0 border-slate-600 border-8 border-b-transparent border-l-transparent",
          isItMine ? "right-0 translate-x-2 -scale-x-100" : "left-0 -translate-x-2",
        )}/>
      </div>
    </motion.li>
  );
}

/** TODO: 
 * - update implementation to use listener as opposed to 'useCollectionData' hooks
 * - implement lazy loader / list virtualizer
 */

const ChatContent = () => {
  const [user] = useAuthState(auth);
  const [queryLimit, setQueryLimit] = useState(10);
  const [queryResult, loading, error, snap] = useCollectionData(FirestoreUtil.queryMessages(queryLimit));
  const [chatMessages, setChatMessages] = useState<ChatMessageDocument[]>([]);
  const totalMessages = useRef(0);
  const limitReached = totalMessages.current <= queryLimit;

  const scrollRef = useRef<HTMLOListElement>(null);
  const topPlaceholderRef = useRef<HTMLDivElement>(null);
  const bottomPlaceholderRef = useRef<HTMLDivElement>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isAtTop = useObserverIntersection(
    scrollRef,
    topPlaceholderRef,
    { rootMargin: '10px', threshold: 1 },
  );
  const isAtBottom = useObserverIntersection(
    scrollRef,
    bottomPlaceholderRef,
    { rootMargin: '10px', threshold: 1 },
  );

  const scrollToBottom = (delay: number = 1000) => {
    setTimeout(() => {
      bottomPlaceholderRef.current?.scrollIntoView({ behavior: "smooth" });
    }, delay)
  };

  const scrollToMessage = (id: string, delay: number = 1000) => {
    setTimeout(() => {
      const doc = document.getElementById(id);
      doc?.scrollIntoView({ behavior: 'smooth' });
    }, delay)
  }

  // For every changes occured on queryResult and is not null/undefined, set the result into chatMessages
  // doing so preventing message flickering
  useEffect(() => {
    if (queryResult) setChatMessages(queryResult);
  }, [queryResult]);

  useEffect(() => {
    // For every new messages added scroll to bottom;
    if (!loading && !isAtBottom) {
      FirestoreUtil.countTotalMessages().then((curTotalMessage) => {
        if (curTotalMessage !== totalMessages.current) {
          scrollToBottom(200);
          totalMessages.current = curTotalMessage;
        }
      })
    }
    // For every load previous messages scroll to lastChat;
     if (!loading && isAtTop) {
      const chatId = chatMessages?.[0]?.id;
      if (chatId) scrollToMessage(chatId, 100);
    }
  }, [chatMessages]);

  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom(1000);
    FirestoreUtil.countTotalMessages().then(
      curTotalMessage => totalMessages.current = curTotalMessage,
    )
  }, []);

  // Load new messages on scroll to top
  useEffect(() => {
    if (isAtTop && totalMessages.current !== 0) {
      if (!limitReached) setQueryLimit(Math.min(queryLimit + 10, totalMessages.current));
    }
  }, [isAtTop]);

  return (
    <main className="flex gap-4 flex-col flex-1 overflow-hidden">
      <ol ref={scrollRef} className="flex flex-grow flex-col gap-3 overflow-x-hidden rounded-lg bg-slate-700 px-3 py-3 md:px-4 md:py-4 overflow-y-scroll">
        {(limitReached && !loading) && (
          <p className='text-slate-300 text-center mt-1 mb-3'>All messages have been loaded</p>
        )}
        {loading && (
            <div role="status" className="flex justify-center">
              <svg aria-hidden="true" className="w-8 h-8 mr-2 text-slate-500 animate-spin dark:text-gray-600 fill-slate-200" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
        )}
        <div id="topPlaceholder" ref={topPlaceholderRef} className={clsx(!limitReached && "mb-8")}/>
        {chatMessages?.map((chatData) => (
          <ChatMessage
            key={chatData?.id}
            chatData={chatData}
            isItMine={user?.uid === chatData.uid}
            setSelectedImage={setSelectedImage}
          />
        ))}
        <div id="bottomPlaceholder" ref={bottomPlaceholderRef} />
      </ol>
      <Modal
        isOpen={!!selectedImage}
        handleClose={() => setSelectedImage(null)}
      >
        <AnimatePresence>
          {selectedImage && (
            <>
              <motion.a
                href={selectedImage}
                target="_blank"
                className="text-sm mb-3 outline-none flex items-center justify-end hover:text-slate-300"
                whileHover={{ translateY: 1 }}
              >
                Open in the new tab
                <ArrowTopRightOnSquareIcon className="text-inherit h-4 w-4 inline ml-2" />
              </motion.a>
              <div className="max-w-2xl rounded-md overflow-hidden">
                <motion.img
                  src={selectedImage}
                  alt='chatimage'
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = '/imgplaceholder.svg';
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              </div>
            </>
          )}
        </AnimatePresence>
      </Modal>
    </main>
  );
};

export default ChatContent;
