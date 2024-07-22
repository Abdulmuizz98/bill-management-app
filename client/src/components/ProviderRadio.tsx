import { providers } from "../data/providers";
import { BmCheck } from "./Icon";
import { useRef, useState } from "react";

export const ProviderRadio = () => {
  let providerRef = useRef<HTMLDivElement | null>(null);
  let choiceRef = useRef<HTMLLabelElement | null>(null);

  function handleSelection(e: React.MouseEvent<HTMLLabelElement, MouseEvent>) {
    console.log(e.currentTarget);
    choiceRef.current = e.currentTarget; // Get the label
    const radioBtn = choiceRef.current.querySelector(
      "input[type=radio"
    ) as HTMLInputElement;

    // Find label with choice-provider class and toggle class off
    const prevLabel = providerRef.current?.querySelector(
      "label.choice-provider"
    );
    prevLabel?.classList.toggle("choice-provider");

    // toggle choice-provider class on for new choice
    choiceRef.current.classList.toggle("choice-provider");
    radioBtn!.checked = true;
  }

  return (
    <div className="flex flex-row w-full gap-2" ref={providerRef}>
      {providers.map(({ name, value, icon }) => (
        <label
          htmlFor={name}
          className="provider-label flex-1 cursor-pointer flex flex-col justify-center items-center space-y-[5px]"
          onClick={handleSelection}
        >
          <div className="wrapper relative border-[0.5px] border-[#D0D5DD] rounded-[5px] w-full">
            <input
              type="radio"
              id="provider"
              name="provider"
              value={value}
              className="absolute"
            />
            <img src={icon} alt={name} className=" w-full " />
            <span className="icon absolute right-[3px] top-[3px]">
              <BmCheck />
            </span>
          </div>
          <span>{name}</span>
        </label>
      ))}
    </div>
  );
};
