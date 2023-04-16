import { GoogleAuthProvider, signInWithPopup, signOut as _signOut } from "firebase/auth";
import { auth } from "./main";

export namespace AuthUtil {
  const googleProvider = new GoogleAuthProvider();

  /**
    * has a possibility to throw an error
    */
  export const signIn = () => {
    return signInWithPopup(auth, googleProvider);
  };

  export const signOut = () => {
    return _signOut(auth);
  }
}
