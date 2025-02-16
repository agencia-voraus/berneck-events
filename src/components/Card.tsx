import React, { useState } from "react";
import { Modal } from "@/components/Modal"; 

type CardProps = {
  nome: string;
  cargo: string;
  cidade: string;
  codigo: string;
  retirado: boolean | null;
  simCheckboxProps?: React.InputHTMLAttributes<HTMLInputElement>;
  simLabel?: string; 
};

const Card: React.FC<CardProps> = ({ 
  nome, 
  cargo, 
  cidade, 
  codigo, 
  retirado, 
  simCheckboxProps, 
  simLabel = "Sim" 
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
      <div className="flex items-center">
        <div className="flex items-center justify-center bg-green-900 text-white text-2xl font-bold rounded-lg w-14 h-14">
          {nome.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 ml-4">
          <div className="text-lg font-bold">{nome}</div>
          <div className="flex">
            <div className="text-sm">
              Cargo: <span className="font-bold">{cargo}</span>
            </div>
            <div className="text-sm ml-10">
              Cidade: <span className="font-bold">{cidade}</span>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-2 border-gray-400" />
      <div className="flex justify-between">
        <div>
          <div className="text-1xl font-bold">Retirou o brinde?</div>
          <div className="flex items-center gap-4 mt-2">
            <label className={`flex items-center ${localRetirado === true ? 'cursor-not-allowed' : 'cursor-pointer'}`}> 
              <input
                type="radio"
                name={`retirado-${codigo}`}
                className="hidden"
                checked={localRetirado === true}
                disabled={localRetirado === true}
                onChange={() => handleRadioChange()}
                {...simCheckboxProps}
              />
              <div className={`w-6 h-6 flex items-center justify-center border rounded-lg ${localRetirado === true ? "bg-accent-green text-white" : "border-gray-600"}`}>
                {localRetirado === true ? "X" : ""}
              </div>
              <span className="ml-2">{simLabel}</span> {/* Usando a prop simLabel aqui */}
            </label>
            <label className={`flex items-center ${localRetirado !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}> 
              <input
                type="radio"
                name={`retirado-${codigo}`}
                className="hidden"
                checked={localRetirado === false}
                disabled={localRetirado !== null}
                onChange={() => handleRadioChange()}
              />
              <div className={`w-6 h-6 flex items-center justify-center border rounded-lg ${localRetirado === false ? "bg-accent-green text-white" : "border-gray-600"}`}>
                {localRetirado === false ? "X" : ""}
              </div>
              <span className="ml-2">Não</span>
            </label>
          </div>
        </div>
        <div className="bg-accent-green text-white text-center px-16 py-2 rounded-lg w-fit self-center">
          <div className="text-sm">Código</div>
          <div className="text-xl font-bold">{codigo}</div>
        </div>
      </div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)} onConfirm={handleConfirm}>
          <p>Tem certeza que deseja confirmar a retirada do brinde?</p>
        </Modal>
      )}
    </div>
  );
};

export default Card;