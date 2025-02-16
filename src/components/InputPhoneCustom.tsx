import React from "react";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface InputPhoneCustomProps {
  label: string;
  value?: string;
  onChange?: (phone: string, country: CountryData) => void;
  className?: string;
  name?: string;
}

export const InputPhoneCustom: React.FC<InputPhoneCustomProps> = ({
  label,
  value = "",
  onChange,
  className = "",
  name = ""
}) => {
  return (
    <div className={`flex flex-col w-full max-w-md ${className}`}>
      <label className="text-3xl font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <PhoneInput
          country={"br"} 
          inputClass="!w-full !border !rounded-lg !bg-gray-100 !text-gray-600 !focus:outline-none !focus:ring-2 !focus:ring-gray-400 mt-1 p-6"
          containerClass="!flex !w-full"
          buttonClass="!border-none !bg-transparent"
          dropdownClass="!bg-white !border !shadow-lg"
          enableSearch={true}
          value={value} // aqui usa diretamente o valor da prop
          autoFormat={true}
          onChange={(phone, country) => {
            if (onChange) onChange(phone, country as CountryData);
          }}
        />
      </div>
    </div>
  );
};

export default InputPhoneCustom;