"use client";
import { useEffect, useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { Footer } from "@/components/Footer";
import Image from "next/image";

type Gift = {
  isPhysical: boolean;
  hasClaimed: boolean;
  code: string;
};

function BrindeContent() {
  const [gift, setGift] = useState<Gift | null>(null);
  const [loading, setLoading] = useState(true);
  const [ebookDownloaded, setEbookDownloaded] = useState(false); 
  const router = useRouter();
  const searchParam = useSearchParams();

  const leadId = useMemo(() => {
    const paramLeadId = searchParam.get("leadId");
    if (typeof window !== "undefined") {
      return paramLeadId || localStorage.getItem("leadId");
    }
    return paramLeadId;
  }, [searchParam]);

  useEffect(() => {
    if (!leadId || leadId === 'undefined') {
      router.push("/client");
    }
  }, [leadId, router]);

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

  const handleDownloadEbook = async () => {
    try {
      const response = await fetch(`/api/ebook/download?leadId=${leadId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ebook.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        setEbookDownloaded(true); 
        router.push("/client/thank-you"); 
      } else {
        console.error("Erro ao baixar o eBook:", await response.text());
      }
    } catch (error) {
      console.error("Erro ao tentar baixar o eBook:", error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-gray-100">
        <div className="w-full max-h-[600px] overflow-hidden flex justify-center items-center bg-gray-100">
          <Image
            src="/banner.jpg"
            alt="Banner Expo Revestir 2025"
            width={1200}
            height={800}
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="flex flex-col items-center mt-6 px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-border-primary font-semibold">Berneck na Expo Revestir 2025</h1>
          {gift && gift.isPhysical ? (
            <>
              <button
                onClick={() => router.push(`/client/gift/withdraw?leadId=${leadId}`)}
                className="mt-8 bg-accent-green h-[80px] w-[200px] sm:h-[100px] sm:w-[250px] md:h-[120px] md:w-[300px] rounded-2xl text-white p-3 flex items-center justify-center shadow-md hover:bg-green-700 transition"
              >
                <FontAwesomeIcon icon={faGift} className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
              </button>
              <p className="mt-4 text-lg sm:text-xl md:text-2xl font-medium text-gray-700 font-bold">Receba seu brinde</p>
            </>
          ) : (
            <>
            <button
              onClick={handleDownloadEbook}
              disabled={ebookDownloaded} 
              className={`mt-8 h-[80px] w-[200px] sm:h-[100px] sm:w-[250px] md:h-[120px] md:w-[300px] rounded-2xl text-white p-3 flex items-center justify-center shadow-md transition ${
                ebookDownloaded ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent-green hover:bg-green-700'
              }`}
            >
              <FontAwesomeIcon icon={faPenToSquare} className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
            </button>
            <p className="mt-4 text-lg sm:text-xl md:text-2xl font-medium text-gray-700 font-bold">
              {ebookDownloaded ? 'E-book já baixado' : 'Baixar E-book'}
            </p>
          </>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}

export default function BrindeScreen() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
      <BrindeContent />
    </Suspense>
  );
}