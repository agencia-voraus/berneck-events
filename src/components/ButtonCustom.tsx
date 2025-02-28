interface ButtonCustomProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: "submit" | "reset" | "button";
    variant?: "default" | "outline" | "ghost" | "link";
  }
  
  export function ButtonCustom({ children, className, onClick, disabled = false, type = 'button', variant = 'default' }: ButtonCustomProps) {
    const variantClasses = {
      default: "bg-accent-green text-white hover:bg-green-700",
      outline: "border border-accent-green text-accent-green bg-transparent hover:bg-green-100",
      ghost: "text-accent-green bg-transparent hover:bg-green-100",
      link: "text-accent-green underline hover:text-green-700"
    };
  
    const disabledClasses = "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300";
  
    return (
      <button
        className={`${disabled ? disabledClasses : variantClasses[variant]} px-6 py-2 rounded-full text-sm font-medium transition ${className}`}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {children}
      </button>
    );
  }