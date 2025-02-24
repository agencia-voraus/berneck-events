"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { InputCustom } from "@/components/InputCustom";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isFormValid = () => {
    return email.trim() !== "" && password.trim() !== "";
  };

  async function handleLogin() {
    if (!isFormValid() || loading) return; 
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login");
      }

      router.replace("/admin/menu");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <Image
        src="/logo.png"
        alt="Berneck Logo"
        width={240}
        height={100}
        className="max-w-60 mb-8"
      />
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <InputCustom
          label="E-mail"
          placeholder="E-mail"
          className="!mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <InputCustom
          label="Senha"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          className={`w-full mt-6 !h-12 !text-xl font-bold text-white py-2 !rounded-xl hover:bg-green-700 transition flex items-center justify-center ${
            loading || !isFormValid()
              ? "!bg-gray-400 !text-white cursor-not-allowed"
              : "bg-green-800 !text-white hover:bg-green-700"
          }`}
          onClick={handleLogin}
          disabled={loading || !isFormValid()}
          type="submit"
        >
          {loading ? <span className="loader"></span> : "Entrar"}
        </Button>
      </form>

      <Footer />
    </div>
  );
}
