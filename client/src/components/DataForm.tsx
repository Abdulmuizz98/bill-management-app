import { ProviderRadio } from "./ProviderRadio";
import Input from "./Input";
import Select from "./Select";
import { SecondaryBtn, PrimaryBtn } from "./Button";
import { useState } from "react";

export default function DataForm() {
  const [dataPlans, setDataPlans] = useState<string[]>([]);

  function handleSubmit(e) {
    e.preventDefault();
  }
  return (
    <form
      className="space-y-[32px] w-full max-w-[400px]"
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <h3 className="text-[16px] font-medium xl:text-[18px] xl:font-bold">
          Buy data
        </h3>
        <p className="text-[14px] xl:text-[16px]">Please enter your details.</p>
      </div>

      <div className="space-y-[24px] w-full">
        <ProviderRadio />
        <Input
          name="phone"
          id="phone"
          type="tel"
          title="Enter your eleven digit phone number."
          required={true}
          label="Phone Number"
        />
        {/* <Input
          name="amount"
          id="amount"
          type="number"
          title="Enter the money's worth of airtime you want to buy."
          required={true}
          label="Amount"
        /> */}
        <Select
          name="select-plan"
          id="select-plan"
          title="Please select a data plan"
          label="Select plan"
          options={dataPlans}
          required={true}
        />

        <Input
          name="email"
          id="email"
          type="email"
          title="Optionally provide an email address."
          required={false}
          label="Email Address"
        />
      </div>

      <div className="space-y-[12px] flex flex-col">
        <PrimaryBtn title="Add to cart" type="submit" />
        <SecondaryBtn title="Proceed to checkout" type="button" />
      </div>
    </form>
  );
}
