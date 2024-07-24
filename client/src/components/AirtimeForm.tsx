import { PrimaryBtn, SecondaryBtn } from "./Button";
import Input from "./Input";
import { ProviderRadio } from "./ProviderRadio";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addCartItem } from "../store/cartSlice";
import { CartItem } from "../types";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AirtimeForm() {
  const [provider, setProvider] = useState("");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log("Phone: ", phone);
  console.log("Amount: ", amount);
  console.log("Provider: ", provider);
  console.log("Email: ", email);

  const dispatch = useAppDispatch();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    e.preventDefault();

    try {
      const response = await axios.get(
        `${BASE_URL}/bills/airtime-info/${phone}`
      );
      const data = await response.data;
      console.log(data);
      const operator = data.opts?.operator;
      const productId = data.products?.[0]?.product_id;

      if (operator !== provider)
        throw new Error(
          `The phone number provided is not a(an) ${provider} number; select ${operator} as provider.`
        );

      const payload: CartItem = {
        phone,
        amount: parseInt(amount, 10),
        category: "airtime",
        provider,
        productId,
        date: new Date().getTime(),
      };
      await dispatch(addCartItem(payload));
      navigate("/checkout");
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
      return;
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="space-y-[32px] w-full max-w-[400px]"
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <h3 className="text-[16px] font-medium xl:text-[18px] xl:font-bold">
          Buy airtime
        </h3>
        <p className="text-[14px] xl:text-[16px]">Please enter your details.</p>
      </div>

      <fieldset disabled={loading} className="space-y-[24px] w-full">
        <ProviderRadio
          field={provider}
          onChange={(e) => setProvider(e.target.value)}
        />
        <Input
          name="phone"
          id="phone"
          type="tel"
          title="Enter your eleven digit phone number."
          required={true}
          label="Phone Number"
          field={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          name="amount"
          id="amount"
          type="text"
          title="Enter the money's worth of airtime you want to buy."
          required={true}
          label="Amount"
          field={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Input
          name="email"
          id="email"
          type="email"
          title="Optionally provide an email address."
          required={false}
          label="Email Address"
          field={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </fieldset>
      <fieldset disabled={loading} className="space-y-[12px] flex flex-col">
        <PrimaryBtn title="Add to cart" type="submit" />
        <SecondaryBtn title="Proceed to checkout" type="button" />
      </fieldset>
    </form>
  );
}
