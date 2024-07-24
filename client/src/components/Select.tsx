import { on } from "events";
import { useState } from "react";

interface SelectProps {
  name: string;
  id: string;
  required: boolean;
  title: string;
  label: string;
  options: string[];
  field: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Input({
  name,
  id,
  required,
  title,
  label,
  field,
  onChange,
  options,
}: SelectProps) {
  // const [option, setOption] = useState("");

  return (
    <label htmlFor={id} className={`w-full h-[70px] relative flex`}>
      <select
        onChange={onChange}
        className={`text-offblack text-[16px] font-medium w-full h-full px-[24px] py-[19px] pt-[40px] bg-lightgray rounded-[16px] peer focus:outline-[#D0D5DD] ${
          field && "border-2 border-[#D0D5DD]"
        }`}
        title={title}
        id={id}
        name={name}
        value={field}
        required={required}
      >
        {options.map((option) => (
          <option value={option}>{option}</option>
        ))}
      </select>
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
