"use client";

import React from "react";
import { Button } from "@/components/Button";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation"; // Importe o useRouter

const Menu = () => {
  const router = useRouter(); 

  const handleCadastrar = () => {
    localStorage.removeItem("leadId");
    localStorage.removeItem("formCompleted");

    router.push("/client");
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-h-[600px] overflow-hidden flex justify-center items-center ">
        <Image
          src="/banner.jpg"
          alt="Banner Expo Revestir 2025"
          width={1200}
          height={800}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="bg-white rounded-2xl  p-6 mt-4 text-center w-80">
        <Image
          src="/logo.png"
          alt="Berneck Logo"
          width={240}
          height={100}
          className="max-w-60 mb-8 mx-auto"
        />
        <p className="text-2xl mb-2">Cadastre-se ou atualize seus dados para receber nosso material.</p>
        
        <Button
          onClick={handleCadastrar}
          className="bg-accent-green text-white w-full py-2 rounded-xl hover:bg-green-800"
        >
          Clique aqui
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default Menu;