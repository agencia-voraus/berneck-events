interface InputDateCustomProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
}

export function InputDateCustom({ label, className = "", ...rest }: InputDateCustomProps) {
  const isMobile = typeof window !== "undefined" && /Mobi|Android/i.test(navigator.userAgent);

  return (
    <div className={`flex flex-col w-full max-w-md ${className}`}>
      <label className="text-2xl font-semibold text-gray-700 mb-2 text-border-primary">
        {label}
      </label>
      <input
        className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 mt-1"
        autoComplete="off"
        type={isMobile ? "text" : "date"} // Usa "text" no mobile e "date" no desktop
        inputMode="numeric" // Sugerir teclado numérico
        pattern="\d{4}-\d{2}-\d{2}" // Formato esperado YYYY-MM-DD
        placeholder="AAAA-MM-DD"
        onFocus={(e) => {
          if (!isMobile) {
            e.currentTarget.showPicker?.();
          }
        }}
        {...rest}
      />
    </div>
  );
}