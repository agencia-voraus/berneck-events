"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { InputCustom } from "@/components/InputCustom";
import InputPhoneCustom from "@/components/InputPhoneCustom";
import Image from "next/image";

export default function Form() {
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const queryLeadId = searchParams.get('leadId') ?? localStorage.getItem("leadId");

  const [formData, setFormData] = useState({
    nome: "",
    cargo: "",
    dataNascimento: "",
    celular: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    uf: "",
    cidade: "",
  });

  const [cepPreenchido, setCepPreenchido] = useState(false);

  useEffect(() => {
    if (queryLeadId) {
      fetch(`/api/lead?leadId=${queryLeadId}`)
        .then((res) => res.json())
        .then((data) => {
          handleChangePhone(data.phone || "");

          setFormData({
            nome: data.fullName || "",
            cargo: data.jobTitle || "",
            dataNascimento: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : "",
            celular: data.phone || "",
            cep: data.zipCode || "",
            rua: data.street || "",
            numero: data.number?.toString() || "",
            complemento: data.complement || "",
            uf: data.state || "",
            cidade: data.city || "",
          });
          if (data.street || data.city || data.state) {
            setCepPreenchido(true);
          }
        })
        .catch((err) => console.error("Erro ao buscar dados do lead:", err));
    }
  }, [queryLeadId]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("leadId");
    
    if (!storedEmail || storedEmail == 'undefined') {
      router.push("/client");
    }
  }, [router]);

  const handleChangePhone = (phone: string) => {
    setFormData((prev) => ({ ...prev, celular: phone }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let cep = e.target.value.replace(/\D/g, "");

    if (cep.length > 5) {
      cep = `${cep.slice(0, 5)}-${cep.slice(5, 8)}`;
    }

    setFormData((prev) => ({ ...prev, cep }));

    if (cep.length === 9) {
      try {
        const numericCep = cep.replace("-", "");
        const response = await fetch(`https://viacep.com.br/ws/${numericCep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            rua: data.logradouro || "",
            cidade: data.localidade || "",
            uf: data.uf || "",
          }));
          setCepPreenchido(true);
        } else {
          console.warn("CEP não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const leadId = localStorage.getItem("leadId");
    if (!leadId) {
      router.push("/client");
      return;
    }
    try {
      const response = await fetch("/api/lead", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: leadId, ...formData }),
      });
      if (response.ok) {
        const data = await response.json();
        const leadId = data.leadId ?? data.lead.id;

        localStorage.setItem("formCompleted", "true");
        localStorage.setItem("leadId", leadId);

        router.replace(`/client/gift?leadId=${leadId}`);
      } 
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mt-10">
            <Image src="/logo.png" alt="Logo da empresa" width={300} height={100} priority className="mb-6" />
          </div>
          <form className="space-y-4 mt-5" onSubmit={handleSubmit}>
            <InputCustom label="Nome completo" type="text" name="nome" placeholder="Nome completo" value={formData.nome} onChange={handleChange} required />
            <InputCustom label="Cargo" type="text" name="cargo" value={formData.cargo} placeholder="Cargo" onChange={handleChange} required />
            <InputCustom label="Data de nascimento" type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required />
            <InputPhoneCustom label="Celular" value={formData.celular} onChange={handleChangePhone} />
            <InputCustom label="CEP" type="text" name="cep" value={formData.cep} onChange={handleCepChange} placeholder="00000-000" required />
            <InputCustom label="Rua" type="text" name="rua" value={formData.rua} onChange={handleChange} placeholder="Rua" required disabled={cepPreenchido} />
            <div className="grid grid-cols-2 gap-4">
              <InputCustom label="Número" type="number" name="numero" value={formData.numero} onChange={handleChange} placeholder="Número" required />
              <InputCustom label="Complemento" type="text" name="complemento" value={formData.complemento} onChange={handleChange} placeholder="Complemento" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col w-full">
                <label className="text-3xl font-semibold text-border-primary mb-2 text-border-primary">UF</label>
                <select name="uf" value={formData.uf} onChange={handleChange} className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 mt-1" disabled={cepPreenchido}>
                  <option value="">Selecione</option>
                  {["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"].map((estado) => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
              <InputCustom label="Cidade" type="text" name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade" required disabled={cepPreenchido} />
            </div>
            <br />
            <div className="flex justify-between mt-5">
              <Button className="!bg-gray-400 !hover:bg-gray-500 p-3 rounded-lg w-full mr-5">Voltar</Button>
              <Button type="submit" className="p-3 rounded-lg w-full">Finalizar</Button>
            </div>
          </form>
        </div>
      </div>
      <Footer isFixed={true} />
    </>
  );
}
