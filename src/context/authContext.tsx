"use client";

import { iUser } from "@/types/types";
import { formatUser } from "@/utils/formatters";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, createUser, getUser } from "../lib/firebase";
import { useLocale } from "next-intl";

interface useProvideAuthProps {
  user: iUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return auth;
};

function useProvideAuth(): useProvideAuthProps {
  const [user, setUser] = useState<iUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  const locale = useLocale();

  const handleUser = async (rawUser?: any): Promise<void> => {
    if (rawUser) {
      const userExist = await getUser(rawUser.uid);

      if (!userExist) {
        const user = formatUser(rawUser, "user");
        createUser(user.uid, user);
        setUser(user);
        setLoading(false);
      } else {
        setUser(userExist as iUser);
        setLoading(false);
      }
    } else {
      setUser(null);
      setLoading(false);
      return;
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, new GoogleAuthProvider());
      const { user } = res;
      handleUser(user);
      router.push(redirectUrl || "/");
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = async () => {
    return auth
      .signOut()
      .then(() => handleUser())
      .then(() => router.push(`/${locale}/login`));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(handleUser);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user && !loading && pathname !== `/${locale}/login`) {
      setRedirectUrl(pathname);
      router.push(`/${locale}/login`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, pathname, locale]);

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };
}
