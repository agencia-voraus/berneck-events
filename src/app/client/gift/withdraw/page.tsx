"use client";
import { useState, useEffect, Suspense } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faHome, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { Footer } from "@/components/Footer";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function GiftContent() {
  const [code, setCode] = useState<string | null>(null);
  const [hasClaimed, setHasClaimed] = useState<boolean | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [ message, setMessage ] = useState<string>();
  const [ messageProm, setMessageProm ] = useState<string>();
  const router = useRouter();
  const searchParam = useSearchParams();

  const leadId = searchParam.get("leadId") || localStorage.getItem("leadId");

  useEffect(() => {
    const fetchGift = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/gift?leadId=${leadId}`);
        if (!response.ok) throw new Error("Erro ao buscar gift, por favor entre em contato com o suporte!");

        const data = await response.json();

        if (!data.code) {
          throw new Error("Código não encontrado. Entre em contato com o suporte.");
        }

        setCode(data.code);
        setHasClaimed(data.hasClaimed);
        setCreatedAt(data.createdAt);





        setError(null);
      } catch (error: unknown) {
        const errorMessage: string = error instanceof Error ? error.message : "Erro ao carregar o gift. Tente novamente mais tarde.";
        setError(errorMessage);
      } finally {
        setIsFadingOut(true);
        setTimeout(() => {
          setLoading(false);
          setIsFadingOut(false);
        }, 500);
      }
    };

    if (leadId) {
      fetchGift();
    } else {
      setLoading(false);
      setError("Lead ID não encontrado.");
    }
  }, [leadId]);

  useEffect(() => {
    const now = new Date();
    const formatDate = new Date(createdAt || '');

    const msg = formatDate.toLocaleDateString() === now.toLocaleDateString()
      ? `Esse código é válido somente para hoje ${formatDate.toLocaleDateString()}`
      : `Código vencido. Venceu em ${formatDate.toLocaleDateString()}`;

    setMessage(msg);
    
    if (formatDate.toLocaleDateString() === now.toLocaleDateString()) {
      const msgProm = hasClaimed 
          ? "Este brinde já foi retirado" 
          : `Apresente o código abaixo para um de nossos consultores. você tem até hoje ${(new Date(createdAt || '')).toLocaleDateString()} `;

          setMessageProm(msgProm);
    } else {
      setMessageProm(`Código vencido. Venceu em ${(new Date(createdAt || '')).toLocaleDateString()}`);
    }

   
    
    
  }, [createdAt, hasClaimed]);

  if (loading || isFadingOut) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 ${isFadingOut ? 'fade-out' : ''}`}>
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-accent-green transition-opacity duration-500 opacity-100"></div>
        <Image 
          src="/logo.png" 
          alt="Logo"
          width={160} 
          height={160} 
          className="w-32 md:w-40 mt-8 transition-opacity duration-500 opacity-100" 
        />
        <p className="mt-4 text-gray-800 text-lg font-semibold transition-opacity duration-500 opacity-100">
          Carregando seu gift...
        </p>
        <p className="mt-2 text-gray-600 text-sm transition-opacity duration-500 opacity-100">
          Isso pode levar alguns segundos
        </p>
      </div>
    );
  }

  if (error || !code) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Image
          src="/logo.png"
          alt="Logo"
          width={160}
          height={160}
          className="w-32 md:w-40 mt-8 transition-opacity duration-500 opacity-100"
        />
        <div className="bg-white rounded-2xl p-6 text-center w-full max-w-xs md:max-w-sm transition-all duration-500 opacity-100 transform translate-y-0">
          <h2 className="text-2xl font-semibold text-gray-800">Erro</h2>
          <p className="text-red-500 font-bold mt-2">
            {error || "Código não encontrado. Entre em contato com o suporte."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-12 py-3 bg-accent-green text-white rounded-md hover:bg-gray-300 transition-all duration-300"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
      <Image
          src="/banner.jpg"
          alt="Banner Expo Revestir 2025"
          layout="responsive"
          width={1920}
          height={512}
          className="w-full h-48 md:h-64 object-cover transition-opacity duration-500 opacity-100"
        />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 mt-[-150px]">
        <div className="bg-white rounded-2xl p-6 text-center w-full max-w-xs md:max-w-sm transition-all duration-500 opacity-100 transform translate-y-0">
          <FontAwesomeIcon icon={faGift} className="text-accent-green text-5xl mb-4 transition-opacity duration-500 opacity-100" />
          <h2 className="text-2xl font-semibold text-gray-800 transition-opacity duration-500 opacity-100">
            Você ganhou um gift
          </h2>
          <p className={`text-accent-green text-accent-green font-bold mt-2 transition-opacity duration-500 opacity-100`}>
             {messageProm}
          </p>
          <div className="mt-4 text-white bg-accent-green text-4xl md:text-6xl font-bold px-8 py-3 rounded-lg transition-opacity duration-500 opacity-100">
            {code}
          </div>
              {!hasClaimed ? (
                 <p className="text-gray-500 mt-5 text-sm font-bold transition-opacity duration-500 opacity-100">
                    {message}
                </p>
              ) : ''}
          <div className="mt-8 md:mt-16 flex flex-row items-center justify-center space-x-8 transition-opacity duration-500 opacity-100">
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={() => router.push(`/client/thank-you/confirmation?leadId=${leadId}`)}
                className="px-12 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all duration-300 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} size="lg" />
              </button>
              <p className="text-gray-800 font-semibold">Onde retirar</p>
            </div>

            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={() => {
                  localStorage.removeItem('leadId');
                  localStorage.removeItem('formCompleted');

                  router.push("/")
                }}
                className="px-12 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-all duration-300 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faHome} size="lg" />
              </button>
              <p className="text-gray-800 font-semibold">Voltar ao inicio</p>
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
}

export default function Gift() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-accent-green"></div>
          <Image
            src="/logo.png"
            alt="Logo"
            width={160}
            height={160}
            className="w-32 md:w-40 mt-8"
          />
        <p className="mt-4 text-gray-800 text-lg font-semibold">
          Carregando seu gift...
        </p>
        <p className="mt-2 text-gray-600 text-sm">
          Isso pode levar alguns segundos
        </p>
      </div>
    }>
      <GiftContent />
    </Suspense>
  );
}