"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import Card from "@/components/Card";
import { Navbar } from "@/components/Navbar";
import { Sliders } from "lucide-react";
import { toast } from "react-toastify";
import { ButtonCustom } from "@/components/ButtonCustom";
import AuthenticatedLayout from "@/components/AuthenticatedLogin";

interface Lead {
  fullName: string;
  jobTitle: string;
  city: string;
}

interface Gift {
  lead: Lead;
  code: string;
  hasClaimed: boolean;
  isPhysical: boolean;
  
}

const GiftList = () => {
  const [filtro, setFiltro] = useState("todos");
  const [showFilters, setShowFilters] = useState(false);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    const fetchGifts = async () => {
      setLoading(true);
      setGifts([]); 
      
      try {
        const res = await fetch(`/api/admin/gift?page=${page}&pageSize=${pageSize}&filter=${filtro}`);
        const data = await res.json();
        
        console.log("Dados recebidos da API:", data.gifts); 
        
        setGifts([...data.gifts]);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.log(error);
        toast.error("Erro ao buscar brindes: Não foi possível carregar os brindes.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchGifts();
  }, [filtro, page]);


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
          <Loader size={64} className="text-accent-green animate-spin" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AuthenticatedLayout>
        <div className="w-full mx-auto p-6 lg:p-8">
          <div className="flex flex-row items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-700">Brindes Distribuídos</h2>
            <div className="flex-col">
              <ButtonCustom onClick={() => setShowFilters(!showFilters)} variant={showFilters ? "default" : "outline"} className="mt-2">
                <Sliders className="w-5 h-5" />
              </ButtonCustom>
            </div>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-3 mb-6"
            >
              {["todos", "entregues", "nao-entregues", "produto-digital"].map((tipo) => (
                <ButtonCustom
                  key={tipo}
                  variant={filtro === tipo ? "default" : "outline"}
                  onClick={() => setFiltro(tipo)}
                >
                  {tipo === "todos"
                    ? "Todos"
                    : tipo === "entregues"
                    ? "Entregues"
                    : tipo === "nao-entregues"
                    ? "Não Entregues"
                    : "Produtos Digitais"}
                </ButtonCustom>
              ))}
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4 w-full max-w-7xl mx-auto">
            {gifts.map((gift: Gift, index) => {
                console.log(`Brinde ${index + 1}:`, {
                  nome: gift.lead.fullName,
                  cargo: gift.lead.jobTitle,
                  cidade: gift.lead.city,
                  codigo: gift.code,
                  retirado: gift.hasClaimed,
                  isPhysical: gift.isPhysical
                });

                return (
                  <Card 
                    key={index} 
                    nome={gift.lead.fullName} 
                    cargo={gift.lead.jobTitle} 
                    cidade={gift.lead.city} 
                    codigo={gift.code} 
                    retirado={gift.hasClaimed} 
                    tipo={gift.isPhysical ? 'physical' : 'digital'}
                  />
                );
              })}

          </div>

          <div  className="flex flex-col sm:flex-row items-center justify-center mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
            <ButtonCustom onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>Anterior</ButtonCustom>
            <span className="py-2 px-4 bg-gray-200 rounded-lg">{page} / {totalPages}</span>
            <ButtonCustom onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>Próximo</ButtonCustom>
          </div>
        </div>
        <Navbar />
      </AuthenticatedLayout>
    </>
  );
};

export default GiftList;
