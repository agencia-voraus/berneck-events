import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LinkButtonProps = {
  href: string;
  title: string;
  Icon: React.ElementType;
  activated?: boolean;
};

export const LinkButton: React.FC<LinkButtonProps> = ({ href, title, Icon, activated }) => {
  return (
    <div className="p-1.5">
      <Link
        href={href}
        prefetch={false}
        className={cn(
          "flex items-center gap-4 px-6 py-1 rounded-lg bg-border-secondary hover:bg-gray-200 transition-all shadow-sm border-t-accent-green border-t-4"
        )}
      >
        <div className="p-3 bg-accent-green rounded-lg text-white">
          <Icon className="w-10 h-9" />
        </div>
        <span className={cn("text-gray-800", activated ? "font-bold" : "font-medium")}>
          {title}
        </span>
      </Link>
    </div>
  );
};