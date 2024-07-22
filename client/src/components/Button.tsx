interface ButtonProps {
  type: "submit" | "button" | "reset" | undefined;
  title: string;
  color: string;
  bg: string;
  customStyles?: string;
}

interface BtnProps {
  type: "submit" | "button" | "reset" | undefined;
  title: string;
}

export default function Button({
  type,
  title,
  bg,
  color,
  customStyles,
}: ButtonProps) {
  return (
    <button type={type} className={`bg-${bg} text-${color} ${customStyles}`}>
      {title}
    </button>
  );
}

export function PrimaryBtn({ type, title }: BtnProps) {
  return (
    <button
      type={type}
      className={`h-[56px] border border-purple  text-purple font-medium rounded-[40px] flex justify-center items-center`}
    >
      {title}
    </button>
  );
}

export function SecondaryBtn({ type, title }: BtnProps) {
  return (
    <button
      type={type}
      className={`h-[56px] border bg-purple text-white font-medium rounded-[40px] flex justify-center items-center`}
    >
      {title}
    </button>
  );
}
