interface InputProps {
  name: string;
  id: string;
  type: string;
  required: boolean;
  title: string;
  label: string;
  field: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  name,
  id,
  type,
  required,
  title,
  label,
  field,
  onChange,
}: InputProps) {
  // const [field, setField] = useState("");

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
        onChange={onChange}
      />
      <span
        className={`absolute top-1/2 left-[24px] translate-y-[-50%] peer-focus:mt-[-15px] ${
          field && "mt-[-15px]"
        }`}
      >
        {label}
      </span>
    </label>
  );
}
