import { useState } from "react";

interface InputProps {
  name: string;
  id: string;
  type: string;
  required: boolean;
  title: string;
  label: string;
}

export default function Input({
  name,
  id,
  type,
  required,
  title,
  label,
}: InputProps) {
  const [field, setField] = useState("");

  return (
    <label htmlFor={id} className={`w-full h-[70px] relative flex`}>
      <input
        className={`text-offblack text-[16px] font-medium w-full h-full px-[24px] py-[19px] pt-[40px] bg-lightgray rounded-[16px] peer focus:outline-[#D0D5DD] ${
          field && "border-2 border-[#D0D5DD]"
        }`}
        title={title}
        type={type}
        id={id}
        name={name}
        required={required}
        value={field}
        onChange={(e) => setField(e.target.value)}
      />
      <span
        className={`absolute top-1/2 left-[24px] translate-y-[-50%] peer-focus:translate-y-[-100%] ${
          field && "translate-y-[-110%]"
        }`}
      >
        {label}
      </span>
    </label>
  );
}
