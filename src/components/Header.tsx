"use client"
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";

interface HeaderProps {
  userName: string;
  userInitial: string;
  hasNotifications: boolean;
  isNotificationText?: string;
}

const Header: React.FC<HeaderProps> = ({ userName, userInitial, hasNotifications, isNotificationText }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      setGreeting("Bom dia");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Boa tarde");
    } else {
      setGreeting("Boa noite");
    }
  }, []);

  return (
    <div className="w-full flex items-center justify-between p-4 bg-white shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 flex items-center justify-center bg-gray-900 text-white rounded-full font-bold">
          {userInitial}
        </div>
        <div>
          <p className="text-xs text-gray-500">{greeting}</p>
          <p className="text-sm font-semibold">{userName}</p>
        </div>
      </div>

      <button
        className={`w-10 h-10 flex items-center justify-center rounded-full ${hasNotifications ? "bg-green-800 text-white" : "bg-gray-400 text-gray-700"}`}
        onClick={() => hasNotifications && setIsModalOpen(true)}
      >
        <FontAwesomeIcon icon={faBell} className="text-lg" width={25} />
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold">Notificações</h2>
              <p className="mt-2 text-gray-600">{ isNotificationText || "Nenhuma nova notificação no momento."}</p>
            <button
              className="mt-4 w-full bg-green-600 text-white p-2 rounded-lg"
              onClick={() => setIsModalOpen(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;