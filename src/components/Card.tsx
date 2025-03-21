import React, { useState } from "react";
import { Modal } from "@/components/Modal";

type CardProps = {
  nome: string;
  cargo: string;
  cidade: string;
  codigo: string;
  retirado: boolean | null;
  tipo: "digital" | "physical";
  simCheckboxProps?: React.InputHTMLAttributes<HTMLInputElement>;
  simLabel?: string; 
};

const Card: React.FC<CardProps> = ({
  nome,
  cargo,
  cidade,
  codigo,
  retirado,
  tipo,
  simCheckboxProps,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [localRetirado, setLocalRetirado] = useState(retirado);

  const handleConfirm = () => {
    setLocalRetirado(true);
    setShowModal(false);
  };

  const handleRadioChange = () => {
    if (localRetirado === null) {
      setShowModal(true);
    }
  };

  return (
    <div className="flex flex-col bg-gray-200 rounded-2xl p-4 w-full max-w-md shadow-md mb-5 justify-center">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center bg-green-900 text-white text-2xl font-bold rounded-lg w-14 h-14">
          {nome.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 ml-4">
          <div className="text-lg font-bold">{nome}</div>
          <div className="flex flex-col sm:flex-row sm:justify-between mt-1">
            <div className="text-sm">
              Cargo: <span className="font-bold">{cargo}</span>
            </div>
            <div className="text-sm mt-1 sm:mt-0">
              Cidade: <span className="font-bold">{cidade}</span>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-2 border-gray-400" />

      {tipo === "physical" && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="w-full">
            <div className="text-xl font-bold mb-2 text-center sm:text-left">
              Retirou o brinde?
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-4">
              <label className={`flex items-center ${localRetirado !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                  type="radio"
                  name={`retirado-${codigo}`}
                  className="hidden"
                  checked={localRetirado === true}
                  disabled={localRetirado !== null}
                  onChange={handleRadioChange}
                  {...simCheckboxProps}
                />
                <div className={`w-6 h-6 flex items-center justify-center border rounded-lg ${localRetirado === true ? "bg-accent-green text-white" : "border-gray-600"}`}>
                  {localRetirado === true ? "X" : ""}
                </div>
                <span className="ml-2">Sim</span>
              </label>

              <label className={`flex items-center ${localRetirado !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                  type="radio"
                  name={`retirado-${codigo}`}
                  className="hidden"
                  checked={localRetirado === false}
                  disabled={localRetirado !== null}
                  onChange={handleRadioChange}
                />
                <div className={`w-6 h-6 flex items-center justify-center border rounded-lg ${localRetirado === false ? "bg-accent-green text-white" : "border-gray-600"}`}>
                  {localRetirado === false ? "X" : ""}
                </div>
                <span className="ml-2">Não</span>
              </label>
            </div>
          </div>
          <div className="bg-accent-green text-white text-center px-6 py-2 rounded-lg">
            <div className="text-sm">Código</div>
            <div className="text-xl font-bold">{codigo}</div>
          </div>
        </div>
      )}

      {tipo === "digital" && (
        <div className="flex flex-col items-center gap-4">
          <div className="text-xl font-bold">Produto Dígital</div>
         
        </div>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)} onConfirm={handleConfirm}>
          <p>Tem certeza que deseja confirmar a retirada do brinde?</p>
        </Modal>
      )}
    </div>
  );
};

export default Card;