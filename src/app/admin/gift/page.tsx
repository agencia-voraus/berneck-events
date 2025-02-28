"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader, Search, Sliders } from "lucide-react";
import Card from "@/components/Card";
import { Navbar } from "@/components/Navbar";
import { toast } from "react-toastify";
import { ButtonCustom } from "@/components/ButtonCustom";
import AuthenticatedLayout from "@/components/AuthenticatedLogin";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
        const res = await fetch(
          `/api/admin/gift?page=${page}&pageSize=${pageSize}&filter=${filtro}&search=${searchQuery}`
        );
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
  }, [filtro, page, searchQuery]); 

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setPage(1); 
  };

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
    <AuthenticatedLayout>
      <div className="w-full mx-auto p-6 lg:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-3xl font-bold text-gray-700">Brindes Distribuídos</h2>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar por nome..."
                className="w-full px-4 py-2 pl-5 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent-green"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-3 text-gray-500 hover:text-black"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            <ButtonCustom onClick={() => setShowFilters(!showFilters)} variant={showFilters ? "default" : "outline"}>
              <Sliders className="w-5 h-5" />
            </ButtonCustom>
          </div>
        </div>

        {showFilters && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-3 mb-6">
            {["todos", "entregues", "nao-entregues", "produto-digital"].map((tipo) => (
              <ButtonCustom key={tipo} variant={filtro === tipo ? "default" : "outline"} onClick={() => setFiltro(tipo)}>
                {tipo === "todos" ? "Todos" : tipo === "entregues" ? "Entregues" : tipo === "nao-entregues" ? "Não Entregues" : "Produtos Digitais"}
              </ButtonCustom>
            ))}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4 w-full max-w-7xl mx-auto">
          {gifts.map((gift: Gift, index) => (
            <Card
              key={index}
              nome={gift.lead.fullName}
              cargo={gift.lead.jobTitle}
              cidade={gift.lead.city}
              codigo={gift.code}
              retirado={gift.hasClaimed}
              tipo={gift.isPhysical ? "physical" : "digital"}
            />
          ))}
        </div>

        <div className="relative pb-20 flex flex-row items-center justify-center mt-6 gap-4">
          <ButtonCustom onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
            <ChevronLeft className="w-5 h-5" />
          </ButtonCustom>

          <span className="py-2 px-4 bg-gray-200 rounded-lg">{page} / {totalPages}</span>

          <ButtonCustom onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
            <ChevronRight className="w-5 h-5" />
          </ButtonCustom>
        </div>

      </div>
      <Navbar />
    </AuthenticatedLayout>
  );
};

export default GiftList;
