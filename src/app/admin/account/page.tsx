"use client";
import { useRouter } from "next/navigation"; // Importando useRouter para redirecionamento
import { LogOut } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { LinkButtonCustom } from "@/components/LinkButtonCustom";
import AuthenticatedLayout from "@/components/AuthenticatedLogin";

const Account = () => {
  const router = useRouter(); 

  const handleLogout = async () => {
    console.log("Logout iniciado no cliente");
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
  
      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie = "token=; Max-Age=0; path=/;";
  
        router.replace("/admin");
        window.location.reload();
      } else {
        console.error("Erro ao fazer logout");
      }
    } catch (error) {
      console.error("Erro ao tentar sair:", error);
    }
  };
  

  return (
    <>
      <AuthenticatedLayout>
        <div className="mt-5">
          <LinkButtonCustom 
            Icon={LogOut}
            title="Sair"
            activated={true}
            onClick={() => {
              handleLogout();
            }} 
          />
        </div>

        <Navbar />
      </AuthenticatedLayout>
    </>
  );
};

export default Account;
