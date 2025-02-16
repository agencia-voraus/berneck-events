"use client"
import { useState } from "react";

export default function GiftValidation() {
  const [code, setCode] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 6 && /^[0-9]*$/.test(value)) {
      setCode(value);
    }
  };

  const handleValidate = () => {
    if (code.length === 6) {
      setIsValid(true);
      alert("Código válido!");
    } else {
      setIsValid(false);
      alert("Código inválido!");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-xl w-80">
      <h2 className="text-gray-700 text-lg font-semibold">VALIDAÇÃO DE CÓDIGO</h2>
      <h3 className="text-gray-500 text-md mb-4">GIFT</h3>
      <input
        type="text"
        value={code}
        onChange={handleChange}
        maxLength={6}
        className="text-center text-xl tracking-widest border-b-2 border-gray-500 focus:outline-none focus:border-green-700 mb-4 w-full py-2"
        placeholder="******"
      />
      <button
        onClick={handleValidate}
        className="bg-green-800 text-white px-6 py-2 rounded-lg hover:bg-green-900 transition duration-200"
      >
        Validar
      </button>
      {isValid === false && <p className="text-red-500 mt-2">Código inválido!</p>}
    </div>
  );
}