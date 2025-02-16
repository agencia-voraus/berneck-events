"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { Navbar } from "@/components/Navbar";
import AuthenticatedLayout from "@/components/AuthenticatedLogin";

const Validator = () => {
  const [userInitial, setUserInitial] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [hasClaimed, setHasClaimed] = useState<boolean>(false);
  const [isReceived, setIsReceived] = useState<boolean>(false);
  const [giftId, setGiftId] = useState<string | null>(null);
  const [claimedAt, setClaimedAt] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 6 && /^[0-9]*$/.test(value)) {
      setCode(value);
    }
  };

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

  const handleValidate = async () => {
    if (code.length === 6) {
      try {
        const response = await fetch(`/api/admin/validator?code=${code}`);
        const data = await response.json();

        if (response.ok) {
          setIsValid(true);
          setGiftId(data.id);
          setFullName(data.lead?.fullName || "Usuário desconhecido");
          setHasClaimed(data.hasClaimed || false);
          setIsReceived(data.isReceived || false);
          setClaimedAt(data.claimedAt || null);
        } else {
          setGiftId(null);
          setIsValid(false);
          setFullName(null);
        }
      } catch (error) {
        console.error("Erro ao validar código:", error);
        setGiftId(null);
        setIsValid(false);
        setFullName(null);
      }
    } else {
      setIsValid(false);
      setGiftId(null);
      setFullName(null);
    }
    setShowModal(true);
  };

  const handleMarkAsReceived = async () => {
    try {
      const response = await fetch(`/api/admin/validator/${giftId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isReceived: true }),
      });

      if (response.ok) {
        setIsReceived(true);
        toast.success("Gift marcado como recebido com sucesso!");
      } else {
        toast.error("Erro ao marcar o gift como recebido.");
      }
    } catch (error) {
      console.error("Erro ao marcar o gift como recebido:", error);
      toast.error("Erro ao conectar com o servidor.");
    }
  };

  const closeModal = () => setShowModal(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Data não disponível";

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <>
      <AuthenticatedLayout>
        <div className="flex items-center justify-center mt-10">
          <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl text-center">
            <h2 className="text-border-primary text-2xl font-bold">VALIDAÇÃO DE CÓDIGO</h2>
            <h3 className="text-border-primary text-2xl mb-4 font-bold">GIFT</h3>
            <input
              type="text"
              value={code}
              onChange={handleChange}
              maxLength={6}
              className="text-center text-5xl tracking-widest border-b-2 border-gray-500 focus:outline-none focus:border-green-700 mb-4 w-full py-2"
              placeholder="******"
            />
            <button
              onClick={handleValidate}
              disabled={!code.trim()}
              className={`px-6 py-2 rounded-lg transition duration-200 ${!code.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-800 text-white hover:bg-green-900'}`}
            >
              Validar
            </button>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg text-center">
              {isValid ? (
                hasClaimed ? (
                  <>
                    <h2 className="text-2xl font-bold text-accent-green">Brinde já foi entregue!</h2>
                    <p className="mt-2">Entregue em: {formatDate(claimedAt)}</p>
                    <button onClick={() => { setShowModal(false); setCode(""); }} className="mt-4 bg-accent-green text-white px-6 py-2 rounded-lg hover:bg-green-900 transition duration-200">Validar outro</button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-green-700">Código válido!</h2>
                    <p className="mt-2">Usuário: {fullName}</p>
                    <button onClick={closeModal} className="mt-4 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200">Fechar</button>
                    {!isReceived && <button onClick={handleMarkAsReceived} className="mt-4 ml-4 bg-accent-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200">Marcar como Recebido</button>}
                    {isReceived && <p className="mt-4 text-green-700">Gift já foi marcado como recebido!</p>}
                  </>
                )
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-red-500">Código inválido!</h2>
                  <button onClick={closeModal} className="mt-4 bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200">Fechar</button>
                </>
              )}
            </div>
          </div>
        )}

        <Navbar />
      </AuthenticatedLayout>
    </>
  );
};

export default Validator;