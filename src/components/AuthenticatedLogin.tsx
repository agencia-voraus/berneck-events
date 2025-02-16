"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Navbar } from "@/components/Navbar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const [userInitial, setUserInitial] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        const data = await response.json();
        if (response.ok) {
          setUserName(data.user.name);
          setUserInitial(data.user.name.charAt(0).toUpperCase());
        } else {
          router.push("/admin");
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        router.push("/admin");
      }
    };
    fetchUser();
  }, [router]);

  return (
    <>
      <Header userInitial={userInitial || "?"} userName={userName || "Usuário"} hasNotifications={false} />
      {children}
      <Navbar />
    </>
  );
};

export default AuthenticatedLayout;