"use client";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { faGift, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { Footer } from "@/components/Footer";
import "@fortawesome/fontawesome-svg-core/styles.css";

export default function Confirmation() {
  const router = useRouter();
  const [code, setCode] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGift = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/gift?leadId=${leadId}`);
        if (!response.ok)
          throw new Error(
            "Erro ao buscar gift, por favor entre em contato com o suporte!"
          );

        const data = await response.json();

        if (!data.code) {
          throw new Error("Código não encontrado. Entre em contato com o suporte.");
        }

        setCode(data.code);
        setError(null);
      } catch (error: unknown) {
        const errorMessage: string =
          error instanceof Error
            ? error.message
            : "Erro ao carregar o gift. Tente novamente mais tarde.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const storedLeadId = localStorage.getItem("leadId");
    if (storedLeadId) {
      setLeadId(storedLeadId);
      fetchGift();
    } else {
      setLoading(false);
      setError("Lead ID não encontrado.");
    }
  }, [leadId]);

  return (
    <>
      <div className="w-full">
        <Image
          src="/banner.jpg"
          alt="Banner Expo Revestir 2025"
          width={1200}
          height={300}
          className="w-full object-cover max-h-60"
        />
      </div>

      <div className="flex flex-col items-center justify-between min-h-screen p-4 mt-[-1.5rem]">
        <div className="bg-white rounded-2xl text-center w-full max-w-md p-6 flex-grow flex flex-col justify-center">
          <FontAwesomeIcon
            icon={faGift}
            className="text-accent-green text-5xl mb-4"
          />
          <h2 className="text-2xl font-semibold text-border-primary">
            Retire seu gift no local indicado
          </h2>

          {/* Exibição do código */}
          {loading ? (
            <p className="text-gray-500 mt-4">Carregando código...</p>
          ) : error ? (
            <p className="text-red-500 mt-4">{error}</p>
          ) : (
            <div className="mt-4 text-white bg-accent-green text-3xl md:text-5xl font-bold px-6 py-3 rounded-lg">
              {code}
            </div>
          )}
        </div>

        <div className="w-full mt-6 flex justify-center">
          <Image
            src="/local.png"
            alt="Localização do gift"
            width={500}
            height={300}
            className="max-w-full h-auto rounded-lg"
            priority
          />
        </div>

        <div className="mt-6 w-full flex flex-col items-center">
            <div className="flex w-full justify-between max-w-xs space-x-4">
              <button
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition flex items-center justify-center"
                onClick={() => {
                  localStorage.removeItem("leadId");
                  localStorage.removeItem("formCompleted");
                  router.push("/client");
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} size="lg" />
              </button>

              <button
                className="flex-1 px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition flex items-center justify-center"
                onClick={() => router.push("/client/thank-you")}
              >
                <FontAwesomeIcon icon={faArrowRight} size="lg" />
              </button>
            </div>

            {/* Textos abaixo dos botões */}
            <div className="mt-2 flex justify-between w-full max-w-xs">
              <p className="text-gray-800 font-semibold text-center flex-1">Voltar</p>
              <p className="text-gray-800 font-semibold text-center flex-1">Próximo</p>
            </div>
          </div>
      </div>

      <Footer isFixed={true} />
    </>
  );
}
