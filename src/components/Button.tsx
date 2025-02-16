interface ButtonProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: "submit" | "reset" | "button"
  }
  
  export function Button({ children, className, onClick, disabled = false, type = 'button' }: ButtonProps) {
    return (
      <button
        className={`bg-green-800 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition ${className}`}
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {children}
      </button>
    );
  }