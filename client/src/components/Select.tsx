import { useState } from "react";

interface SelectProps {
  name: string;
  id: string;
  required: boolean;
  title: string;
  label: string;
  options: string[];
}

export default function Input({
  name,
  id,
  required,
  title,
  label,
  options,
}: SelectProps) {
  const [option, setOption] = useState("");

  return (
    <label htmlFor={id} className={`w-full h-[70px] relative flex`}>
      <select
        className={`text-offblack text-[16px] font-medium w-full h-full px-[24px] py-[19px] pt-[40px] bg-lightgray rounded-[16px] peer focus:outline-[#D0D5DD] ${
          option && "border-2 border-[#D0D5DD]"
        }`}
        title={title}
        id={id}
        name={name}
        value={option}
        required={required}
        onChange={(e) => setOption(e.target.value)}
      >
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
      <span
        className={`absolute top-1/2 left-[24px] translate-y-[-50%] peer-focus:translate-y-[-100%] ${
          option && "translate-y-[-110%]"
        }`}
      >
        {label}
      </span>
    </label>
  );
}
