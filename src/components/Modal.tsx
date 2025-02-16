import React from "react";

type ModalProps = {
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ onClose, onConfirm, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-accent-green text-white rounded-lg"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};