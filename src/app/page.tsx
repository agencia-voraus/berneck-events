import React from "react";
import Header from "@/components/Header";
import { LinkButton } from "@/components/LinkButton";
import { Navbar } from "@/components/Navbar";
import { Gift, QrCodeIcon, ClipboardPenLine, GitCompareArrows } from "lucide-react";


const Menu = () => {
  return (
    <>
      <Header 
        userInitial="A"
        userName="Allan Camargo"
        key={1}
        hasNotifications={true}
      />

      <div className="w-full max-w-md mx-auto text-center mt-5">
        <h1 className="text-2xl font-bold text-border-primary mb-3">Berneck na Feira 2025</h1>
        <div className="w-full rounded-lg p-3 overflow-hidden">
          <img src="/banner.jpg" alt="Banner Expo Horizontes Berneck" className="w-full h-auto object-cover rounded-xl" />
        </div>
      </div>

      <div className="mt-10">
        <LinkButton 
          href="/brindes" 
          title="Quantidade de brindes distribuídos" 
          Icon={() => <Gift />} 
        />
        <LinkButton 
          href="/brindes" 
          title="Controle de Brindes" 
          Icon={() => <GitCompareArrows />} 
        />
        <LinkButton 
          href="/brindes" 
          title="Relatório" 
          Icon={() => <ClipboardPenLine />} 
        />
        <LinkButton 
          href="/brindes" 
          title="Validar código GIFT" 
          Icon={() => <QrCodeIcon />} 
          activated={true}
        />
      </div>

      <Navbar />

    </>
  );
};

export default Menu;