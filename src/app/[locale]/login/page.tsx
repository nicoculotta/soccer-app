"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const { theme } = useTheme();
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  const t = useTranslations("login");

  useEffect(() => {
    if (user) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <main className="h-screen grid grid-cols-1 md:grid-cols-2 grid-rows-[40%,60%] md:grid-rows-1">
      <div className="bg-[url('https://images.unsplash.com/photo-1552318965-6e6be7484ada?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] w-full h-full bg-cover bg-center"></div>

      <div className="flex flex-col">
        <div className="flex flex-col justify-center items-center h-full mb-20 md:mb-0">
          <Image
            src={theme === "light" ? "/furbo.svg" : "/furbo-dark.svg"}
            alt="Furbo Logo"
            width={180}
            height={40}
            className="mb-6"
          />
          <div className="flex flex-col gap-2 max-w-sm w-full px-4">
            <Button onClick={signInWithGoogle}>{t("withGoogleButton")}</Button>
            <p className="mt-4 text-xs text-muted-foreground text-center">
              {t("comingSoon")}
            </p>
            <Button disabled className="cursor-not-allowed">
              {t("withFacebookButton")}
            </Button>
            <Button disabled className="cursor-not-allowed">
              {t("withTwitterButton")}
            </Button>
          </div>
        </div>

        <span className="text-xs text-muted-foreground text-center py-3">
          {t("createdBy")}{" "}
          <a href="https://www.linkedin.com/in/nicolasculotta/">Nico Culotta</a>
        </span>
      </div>
    </main>
  );
}
