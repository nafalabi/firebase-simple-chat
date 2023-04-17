export const getFBConfig = () => {
  const config = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
    projectId:import.meta.env.VITE_FIREBASE_PROJECTID,
    storageBucket:import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
    messagingSenderId:import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_FIREBASE_APPID,
  } as const;

  if (Object.values(config).some(cfg => !cfg))
    throw new Error("Firebase Config is Invalid");

  return config;
};

export default getFBConfig;
