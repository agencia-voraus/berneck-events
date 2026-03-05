interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
  error?: boolean;
}

export function InputCustom({ label, className = "", error, ...rest }: InputProps) {
  return (
    <div className={`flex flex-col w-full max-w-md ${className}`}>
      <label className="text-2xl font-semibold text-gray-700 mb-2 text-border-primary">
        {label}
      </label>
      <input
        className={`w-full p-3 border rounded-lg bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 mt-1 ${
          error
            ? "border-red-500 focus:ring-red-400 focus:border-red-500"
            : "border-gray-300 focus:ring-gray-400"
        }`}
        autoComplete="off"
        {...rest}
      />
    </div>
  );
}