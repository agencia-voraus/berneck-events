"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { ClipboardPenLine } from "lucide-react"; 
import { LinkButton } from "@/components/LinkButton";
import AuthenticatedLayout from "@/components/AuthenticatedLogin";

const Report = () => {
  const [totalGenerated, setTotalGenerated] = useState(0); 
  const [totalClaimed, setTotalClaimed] = useState(0); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch('/api/admin/report');
        if (!response.ok) {
          throw new Error('Erro ao buscar contagens');
        }
        const data = await response.json();
        setTotalGenerated(data.totalGenerated);
        setTotalClaimed(data.totalClaimed);
      } catch (error) {
        console.error('Erro ao buscar contagens:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Loader size={64} className="text-accent-green animate-spin" />
        </motion.div>
      </div>
    );
  }

  return (
    <AuthenticatedLayout>
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-700">Relatório</h2>
        </div>
      </div>

      <div>
        <LinkButton 
          Icon={() => <ClipboardPenLine />}
          href=""
          title="Relatório"
          activated={true}
        />
      </div>

      <div className="w-full max-w-xs mx-auto p-4 text-center mt-5">
        <div className="mb-4">
          <p className="text-border-primary text-lg font-bold">Total de códigos gerados</p>
          <p className="text-accent-green text-4xl font-bold">{totalGenerated || 0}</p>
        </div>
        <hr className="border-gray-300" />
        <div className="mt-4">
          <p className="text-border-primary text-lg font-bold">Total de códigos resgatados</p>
          <p className="text-accent-green text-4xl font-bold">{totalClaimed || 0}</p>
        </div>
      </div>

      <Navbar />
    </AuthenticatedLayout>
  );
};

export default Report;