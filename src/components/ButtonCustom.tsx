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
      default: "bg-green-800 text-white hover:bg-green-700",
      outline: "border border-green-800 text-green-800 bg-transparent hover:bg-green-100",
      ghost: "text-green-800 bg-transparent hover:bg-green-100",
      link: "text-green-800 underline hover:text-green-700"
    };
  
    return (
      <button
        className={`${variantClasses[variant]} px-6 py-2 rounded-full text-sm font-medium transition ${className}`}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {children}
      </button>
    );
  }
  