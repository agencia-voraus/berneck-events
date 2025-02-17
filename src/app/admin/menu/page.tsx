"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { LinkButton } from "@/components/LinkButton";
import { Navbar } from "@/components/Navbar";
import { Check, CirclePause, QrCodeIcon, ClipboardPenLine, GitCompareArrows } from "lucide-react";
import { LinkCustom } from "@/components/LinkCustom";
import Image from "next/image";

const Menu = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userInitial, setUserInitial] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [totalAvailable, setTotalAvailable] = useState<number>(0);
  const [redeemedCount, setRedeemedCount] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTotalAvailable, setNewTotalAvailable] = useState<number>(100);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        const data = await response.json();
        if (response.ok) {
          setUserName(data.user.name);
          setUserInitial(data.user.name.charAt(0).toUpperCase());
          console.log(data.user.role);
          if (data.user.role == 'ADMIN') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          router.push("/admin");
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        router.push("/admin");
      }
    };

    const fetchStatus = async () => {
      try {
        const response = await fetch("/api/status");

        if (!response.ok) {
          throw new Error(`Erro na resposta do servidor: ${response.status}`);
        }

        const data = await response.json();

        if (data && typeof data.isActive === "boolean") {
          setIsActive(data.isActive);
          setTotalAvailable(data.totalAvailable);
          setRedeemedCount(data.redeemedCount);
        } else {
          console.error("Resposta inesperada da API:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar status da distribuição:", error);
      }
    };

    fetchUser();
    fetchStatus();
  }, [router]);

  const toggleStatus = async () => {
    try {
      const body = isActive ? { isActive: false } : { isActive: true, totalAvailable: newTotalAvailable };

      const response = await fetch("/api/status/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setIsActive(data.isActive);
        if (data.newGiftStock) {
          setTotalAvailable(data.newGiftStock.totalAvailable);
          setRedeemedCount(0);
        }
        setIsModalOpen(false);
      } else {
        console.error("Erro ao atualizar status:", data.error);
      }
    } catch (error) {
      console.error("Erro ao tentar alternar status:", error);
    }
  };

  return (
    <>
      <Header 
        userInitial={userInitial || "?"}
        userName={userName || "Usuário"}
        hasNotifications={true}
        isNotificationText={ isActive ? `Brindes Disponíveis: ${totalAvailable - redeemedCount}` : ""}
      />

      <div className="w-full max-w-md mx-auto text-center mt-5">
        <h1 className="text-2xl font-bold text-border-primary mb-3">Berneck na Feira 2025</h1>
        <div className="w-full rounded-lg p-3 overflow-hidden">
          <Image
            src="/banner.jpg"
            alt="Banner Expo Horizontes Berneck"
            width={1200}
            height={400}
            className="w-full h-auto object-cover rounded-xl"
          />
        </div>
      </div>

      <div className="mt-10">
        <LinkButton 
          href="/admin/gift" 
          title="Controle de Brindes" 
          Icon={() => <GitCompareArrows />} 
        />
        <LinkButton 
          href="/admin/report" 
          title="Relatório" 
          Icon={() => <ClipboardPenLine />} 
        />
        <LinkButton 
          href="/admin/validator" 
          title="Validar código GIFT" 
          Icon={() => <QrCodeIcon />} 
        />

        {isAdmin && (
            <LinkCustom
              title={!isActive ? "Habilitar distribuição de códigos" : "Desabilitar distribuição de códigos"}
              Icon={!isActive ? Check : CirclePause}
              onClick={() => setIsModalOpen(true)}
            />
        )}
      </div>

      <Navbar />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center w-96">
            <h2 className="text-xl font-bold text-gray-800">
              {isActive ? "Deseja encerrar a distribuição?" : "Iniciar nova distribuição"}
            </h2>

            {!isActive && (
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-700">Quantidade de Brindes:</label>
                <input
                  type="number"
                  value={newTotalAvailable}
                  onChange={(e) => setNewTotalAvailable(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md p-2 mt-2 text-center"
                  min="1"
                />
              </div>
            )}

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-800 border-gray-400 hover:bg-gray-200 transition"
              >
                Voltar
              </button>

              <button
                onClick={toggleStatus}
                className={`px-4 py-2 rounded-md text-white font-bold transition ${
                  isActive ? "bg-red-600 hover:bg-red-800" : "bg-green-600 hover:bg-green-800"
                }`}
              >
                {isActive ? "Encerrar" : "Iniciar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
