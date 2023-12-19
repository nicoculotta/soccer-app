"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <main className="max-w-sm px-2 mx-auto h-screen flex flex-col justify-center">
      <div>
        <h1 className="text-2xl font-medium text-center">Fútbol El Palo</h1>
        <div className="flex flex-col gap-2">
          <Button onClick={signInWithGoogle}>Entrar con Google</Button>
          <Button>Entrar con Facebook</Button>
          <Button>Entrar con Twitter</Button>
        </div>
      </div>
    </main>
  );
}
