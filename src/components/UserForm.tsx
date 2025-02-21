"use client";

import { useState } from "react";
import { User } from "@/types/User";
import { Button } from "./Button";
import { ButtonCustom } from "./ButtonCustom";

interface UserFormProps {
  onSubmit: (user: User) => void;
  initialData?: Partial<User>;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, initialData = {}, onClose }) => {
  const [name, setName] = useState<string>(initialData.name || "");
  const [email, setEmail] = useState<string>(initialData.email || "");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<User['role']>(initialData.role || "USER");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ id: initialData.id || Date.now(), name, email, password, role });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg  w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold text-center mb-4">Gerenciar Usuário</h2>
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Nome</label>
        <input
          type="text"
          placeholder="Digite o nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="Digite o e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Senha</label>
        <input
          type="password"
          placeholder="Digite a senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!initialData.id}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Função</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as User['role'])}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <ButtonCustom className="border-red-600 text-red-600 hover:bg-red-100" type="button" onClick={onClose} variant="outline">
          Cancelar
        </ButtonCustom>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};

export default UserForm;
