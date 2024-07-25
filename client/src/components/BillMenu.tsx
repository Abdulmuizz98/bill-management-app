import { useState } from "react";
import AirtimeForm from "./AirtimeForm";
import DataForm from "./DataForm";

const menuData = [
  {
    key: "airtime",
    menu: <AirtimeForm />,
    title: "Buy airtime",
  },
  {
    key: "data",
    menu: <DataForm />,
    title: "Buy data",
  },
  {
    key: "utilities",
    menu: <AirtimeForm />,
    title: "Buy utilities",
  },
];

export default function BillMenu() {
  const [active, setActive] = useState("airtime");

  return (
    <>
      <nav className="flex flex-row my-[36px] w-100 h-[44px] bg-yellow-500 font-medium">
        {menuData.map(({ key, title }, index) => (
          <button
            key={index}
            type="button"
            className={`flex-1 xl:text-[16px] xl:font-medium ${
              active === key &&
              "border-b-2 border-purple bg-lightpurple text-purple"
            }`}
            onClick={() => {
              setActive(key);
            }}
          >
            {title}
          </button>
        ))}
      </nav>
      {menuData.find((item) => item.key === active)?.menu}
    </>
  );
}
