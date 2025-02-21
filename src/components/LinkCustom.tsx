import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LinkCustomProps = {
  href?: string;
  title: string;
  Icon: React.ElementType;
  activated?: boolean;
  onClick?: () => void;
  classCustom?: string;
};

export const LinkCustom: React.FC<LinkCustomProps> = ({ href, title, Icon, activated, onClick, classCustom }) => {
  const content = (
    <div
      className={cn(
        `flex items-center gap-4 px-6 py-1 w-full rounded-lg bg-border-secondary hover:bg-gray-200 transition-all shadow-sm border-t-4 ${classCustom}`,
        activated ? "border-t-accent-green font-bold" : "border-t-accent-green font-medium"
      )}
    >
      <div className="p-3 bg-accent-green border-t-accent-green rounded-lg text-white flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-gray-800">{title}</span>
    </div>
  );

  return (
    <div className="p-1.5">
      {href ? (
        <Link href={href} prefetch={false}>
          {content}
        </Link>
      ) : (
        <button type="button" role="button" onClick={onClick} className="w-full">
          {content}
        </button>
      )}
    </div>
  );
};
