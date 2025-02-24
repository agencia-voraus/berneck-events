"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { InputCustom } from "@/components/InputCustom";
import InputPhoneCustom from "@/components/InputPhoneCustom";
import Image from "next/image";

function FormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryLeadId =
    searchParams.get("leadId") ?? localStorage.getItem("leadId");

  const [dateError, setDateError] = useState("");
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

  useEffect(() => {
    if (queryLeadId) {
      fetch(`/api/lead?leadId=${queryLeadId}`)
        .then((res) => res.json())
        .then((data) => {
          handleChangePhone(data.phone || "");

          setFormData({
            nome: data.fullName || "",
            cargo: data.jobTitle || "",
            dataNascimento: data.birthDate ? formatDate(data.birthDate) : "",
            celular: data.phone || "",
            cep: data.zipCode || "",
            rua: data.street || "",
            numero: data.number?.toString() || "",
            complemento: data.complement || "",
            uf: data.state || "",
            cidade: data.city || "",
          });
        })
        .catch((err) => console.error("Erro ao buscar dados do lead:", err));
    }
  }, [queryLeadId]);

  useEffect(() => {
    const storedLeadId = localStorage.getItem("leadId");

    if (!storedLeadId || storedLeadId === "undefined") {
      router.push("/client");
    }
  }, [router]);

  const handleChangePhone = (phone: string) => {
    setFormData((prev) => ({ ...prev, celular: phone }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        const response = await fetch(
          `https://viacep.com.br/ws/${numericCep}/json/`
        );
        const data = await response.json();

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            rua: data.logradouro || "",
            cidade: data.localidade || "",
            uf: data.uf || "",
          }));
        } else {
          console.warn("CEP não encontrado");
        }
      } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
      }
    }
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    if (value.length > 5) {
      value = `${value.slice(0, 5)}/${value.slice(5, 9)}`;
    }

    setFormData((prev) => ({ ...prev, dataNascimento: value }));

    if (value.length === 10) {
      if (!isValidDate(value)) {
        setDateError("Data inválida. Use o formato dd/mm/aaaa.");
      } else {
        setDateError("");
      }
    } else {
      setDateError("");
    }
  };

  const isValidDate = (dateStr: string) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(regex);

    if (!match) return false;

    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const year = parseInt(match[3], 10);

    const date = new Date(year, month, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    );
  };

  const formatDateForBackend = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const isBrazilianPhone = formData.celular.trim().startsWith("+55");

  const isFormValid = () => {
    const {
      nome,
      cargo,
      dataNascimento,
      celular,
      cep,
      rua,
      numero,
      uf,
      cidade,
    } = formData;

    return (
      nome.trim() !== "" &&
      cargo.trim() !== "" &&
      celular.trim() !== "" &&
      isValidDate(dataNascimento) &&
      !dateError &&
      (!isBrazilianPhone || (
        cep.trim() !== "" &&
        rua.trim() !== "" &&
        numero.trim() !== "" &&
        uf.trim() !== "" &&
        cidade.trim() !== ""
      ))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const leadId = localStorage.getItem("leadId");

    if (!leadId) {
      router.push("/client");
      return;
    }

    if (dateError) {
      alert("Corrija os erros antes de enviar.");
      return;
    }

    const formattedData = {
      ...formData,
      dataNascimento: formatDateForBackend(formData.dataNascimento),
    };

    try {
      const response = await fetch("/api/lead", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, ...formattedData }),
      });

      if (response.ok) {
        const data = await response.json();
        const newLeadId = data.leadId ?? data.lead.id;

        localStorage.setItem("formCompleted", "true");
        localStorage.setItem("leadId", newLeadId);

        router.replace(`/client/gift?leadId=${newLeadId}`);
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
            <Image
              src="/logo.png"
              alt="Logo da empresa"
              width={300}
              height={100}
              priority
              className="mb-6"
            />
          </div>

          <form className="space-y-4 mt-5" onSubmit={handleSubmit}>
            <InputCustom
              label="Nome completo"
              type="text"
              name="nome"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            <InputCustom
              label="Cargo"
              type="text"
              name="cargo"
              value={formData.cargo}
              placeholder="Cargo"
              onChange={handleChange}
              required
            />
            <InputCustom
              label="Data de nascimento"
              type="text"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChangeDate}
              placeholder="dd/mm/aaaa"
              required
            />
            {dateError && (
              <p className="text-red-500 text-sm mt-1">{dateError}</p>
            )}

            <InputPhoneCustom
              label="Celular"
              value={formData.celular}
              onChange={handleChangePhone}
            />
            <InputCustom
              label="CEP"
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleCepChange}
              placeholder="00000-000"
              required={isBrazilianPhone}
            />
            <InputCustom
              label="Rua"
              type="text"
              name="rua"
              value={formData.rua}
              onChange={handleChange}
              placeholder="Rua"
              required={isBrazilianPhone}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputCustom
                label="Número"
                type="number"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Número"
                required={isBrazilianPhone}
              />
              <InputCustom
                label="Complemento"
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                placeholder="Complemento"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col w-full">
                <label className="text-3xl font-semibold mb-2">UF</label>
                <select
                  name="uf"
                  value={formData.uf}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 mt-1"
                  required={isBrazilianPhone}
                >
                  <option value="">Selecione</option>
                  {[
                    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES",
                    "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR",
                    "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
                    "SP", "SE", "TO",
                  ].map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
              <InputCustom
                label="Cidade"
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Cidade"
                required={isBrazilianPhone}
              />
            </div>

            <div className="flex justify-between mt-5">
              <Button
                className="!bg-gray-400 !hover:bg-gray-500 p-3 rounded-lg w-full mr-5"
                onClick={() => {
                  localStorage.clear();
                  router.push("/client");
                }}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                className={`p-3 rounded-lg w-full ${
                  !isFormValid() ? "!bg-gray-300 cursor-not-allowed" : ""
                }`}
                disabled={!isFormValid()}
              >
                Finalizar
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Footer isFixed={true} />
    </>
  );
}

export default function Form() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormContent />
    </Suspense>
  );
}
