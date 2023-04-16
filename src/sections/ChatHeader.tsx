import { FunctionComponent } from 'react';
import { HTMLMotionProps, motion } from "framer-motion";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../libs/firebase/main';
import { AuthUtil } from '../libs/firebase/auth';

const AuthButton: FunctionComponent<HTMLMotionProps<'button'>> = (props) => {
  return (
    <motion.button
      className="bg-slate-700 rounded-md px-4 py-2 text-white"
      whileTap={{ scale: 0.8 }}
      {...props}
    />
  )
}

const ChatHeader = () => {
  const [user, isLoading, errorMsg] = useAuthState(auth);

  const handleSignIn = async () => {
    AuthUtil.signIn().catch(error => {
      /** TODO: implement error handling */
      console.log(error);
    });
  }

  const handleSignOut = async () => {
    AuthUtil.signOut();
  }

  return (
    <header className="flex justify-between mb-4">
      <h1 className="text-white my-auto text-lg">Firebase Simple Chat</h1>
      <AuthButton onClick={user ? handleSignOut : handleSignIn}>
        {user ? "Sign out" : "Sign in"}
      </AuthButton>
    </header>
  );
};

export default ChatHeader;
