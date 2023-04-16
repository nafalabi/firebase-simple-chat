import ChatContent from "./sections/ChatContent";
import ChatHeader from "./sections/ChatHeader";
import ChatInput from "./sections/ChatInput";

const App = () => {
  return (
    <div className="flex h-screen w-screen justify-center bg-slate-950 p-2 md:p-5 overflow-hidden">
      <div className="sm:w-full md:max-w-3xl bg-slate-800 p-4 md:p-6 rounded-md h-full flex flex-col overflow-hidden">
        <ChatHeader />
        <ChatContent />
        <ChatInput />
      </div>
    </div>
  );
};

export default App;
