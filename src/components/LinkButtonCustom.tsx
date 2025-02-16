"use client"
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react"; // Ícone de seta para a direita

type LinkButtonCustomProps = {
  href?: string;
  title: string;
  Icon: React.ElementType;
  activated?: boolean;
  onClick?: () => void; 
};

export const LinkButtonCustom: React.FC<LinkButtonCustomProps> = ({
  href,
  title,
  Icon,
  activated,
  onClick,
}) => {
  const buttonContent = (
    <div
      className={cn(
        "flex items-center justify-between px-6 py-6 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all w-full"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-black" />
        <span className={cn("text-black", activated ? "font-bold" : "font-medium")}>
          {title}
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-600" />
    </div>
  );

  return (
    <div className="p-1.5">
      {onClick ? (
        <button onClick={onClick} className="w-full">{buttonContent}</button>
      ) : (
        <Link href={href ?? "#"}>{buttonContent}</Link>
      )}
    </div>
  );
};
