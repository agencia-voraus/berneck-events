interface InputDateCustomProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
}

export function InputDateCustom({ label, className = "", ...rest }: InputDateCustomProps) {
  return (
    <div className={`flex flex-col w-full max-w-md ${className}`}>
      <label className="text-2xl font-semibold text-gray-700 mb-2 text-border-primary">
        {label}
      </label>
      <input
        className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 mt-1"
        autoComplete="off"
        type="text" 
        inputMode="numeric" 
        pattern="\d{4}-\d{2}-\d{2}" 
        placeholder="AAAA-MM-DD"
        onFocus={(e) => {
          e.preventDefault();
          e.target.setAttribute('type', 'text'); 
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault(); 
          }
        }}
        {...rest}
      />
    </div>
  );
}