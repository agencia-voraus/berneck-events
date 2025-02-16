"use client";
import { usePathname, useRouter } from "next/navigation";
import { Home, Gift, User, QrCodeIcon } from "lucide-react";

const routes: Record<string, string> = {
  Home: "/admin/menu",
  Validar: "/admin/validator",
  Brindes: "/admin/gift",
  Perfil: "/admin/account",
};

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ icon: Icon, label, active, onClick }) => {
  return (
    <button
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
        active ? "bg-gray-200 text-black" : "text-gray-400"
      }`}
      onClick={onClick}
    >
      <div className={`p-2 rounded-full ${active ? "bg-green-800 text-white" : "text-gray-400"}`}>
        <Icon size={20} />
      </div>
      {active && <span className="font-medium">{label}</span>}
    </button>
  );
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigation = (tab: string) => {
    router.push(routes[tab]);
  };

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white shadow-md p-4 flex justify-center">
      <nav className="flex space-x-4">
        {Object.entries(routes).map(([label, path]) => (
          <NavButton
            key={label}
            icon={
              label === "Home"
                ? Home
                : label === "Validar"
                ? QrCodeIcon
                : label === "Brindes"
                ? Gift
                : User
            }
            label={label}
            active={pathname === path}
            onClick={() => handleNavigation(label)}
          />
        ))}
      </nav>
    </footer>
  );
}
