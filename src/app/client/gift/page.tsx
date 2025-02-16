"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { Footer } from "@/components/Footer";

type Gift = {
  isPhysical: boolean;
  hasClaimed: boolean;
  code: string;
};

export default function BrindeScreen() {
  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParam = useSearchParams();

  const leadId = searchParam.get("leadId") || localStorage.getItem("leadId");

  useEffect(() => {
    if (!leadId || leadId == 'undefined') {
      router.push("/client");
    }
  }, [leadId]);

  useEffect(() => {
    const fetchGift = async () => {
      try {
        const response = await fetch(`/api/gift?leadId=${leadId}`);
        if (response.ok) {
          const data: Gift = await response.json();
          setGift(data);
        } else {
          console.error("Erro ao buscar o brinde:", await response.text());
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      } finally {
        setLoading(false);
      }
    };

    if (leadId) {
      fetchGift();
    } else {
      setLoading(false);
    }
  }, [leadId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="w-full">
        <img src="/banner.jpg" alt="Banner Expo Revestir 2025" className="w-full object-cover" />
      </div>

      <div className="flex flex-col items-center mt-6 px-4 text-center">
        <h1 className="text-2xl text-border-primary font-semibold">Berneck na Expo Revestir 2025</h1>
        {gift && gift.isPhysical ? (
          <>
            <button
              onClick={() => router.push(`/client/gift/withdraw?leadId=${leadId}`)}
              className="mt-8 bg-accent-green h-[80px] w-[200px] rounded-2xl text-white p-3 flex items-center justify-center shadow-md hover:bg-green-700 transition"
            >
              <FontAwesomeIcon icon={faGift} className="w-10 h-10 text-white" />
            </button>
            <p className="mt-4 text-lg font-medium text-gray-700 font-bold">Receba seu brinde</p>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/cadastro")}
              className="mt-8 bg-accent-green h-[80px] w-[200px] rounded-2xl text-white p-3 flex items-center justify-center shadow-md hover:bg-green-700 transition"
            >
              <FontAwesomeIcon icon={faPenToSquare} className="w-10 h-10 text-white" />
            </button>
            <p className="mt-4 text-lg font-medium text-gray-700 font-bold">Baixar E-book</p>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
