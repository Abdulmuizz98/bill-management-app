import { ProviderRadio } from "./ProviderRadio";
import Input from "./Input";
import Select from "./Select";
import { SecondaryBtn, PrimaryBtn } from "./Button";
import { useState, useEffect } from "react";
import axios from "axios";
import { debounce } from "../utils";
import { addCartItem } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../types";
import { useAppDispatch } from "../store/hooks";
import { toast } from "react-toastify";

export default function DataForm() {
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([]);
  const [provider, setProvider] = useState("");
  const [plan, setPlan] = useState<DataPlan | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log("Phone: ", phone);
  console.log("Plan: ", plan);
  console.log("Provider: ", provider);
  console.log("Email: ", email);

  interface DataPlan {
    productId: string;
    price: number;
    denomination: number;
    currency: string;
    name: string;
  }

  // {
  //   "product_id": "D-MFIN-6-250MB",
  //   "openRange": false,
  //   "topup_currency": "NGN",
  //   "currency": "NGN",
  //   "rate": 0.94,
  //   "price": 25.0,
  //   "denomination": 25.0,
  //   "data_amount": "250"
  // }

  useEffect(() => {
    const debouncePhoneAndProvider = debounce(() => {
      axios
        .get(`${BASE_URL}/bills/data-info/${phone}`)
        .then((response) => response.data)
        .then((data) => {
          const operator = data.opts?.operator;
          if (operator !== provider)
            throw new Error(
              `The phone number provided is not a(an) ${provider} number; select ${operator} as provider.`
            );

          const products = data.products;
          if (products) {
            const dataPlans: DataPlan[] = products.map((product) => {
              const name = getNameFromProdId(product.product_id);
              return {
                productId: product.product_id,
                price: product.price,
                denomination: product.denomination,
                currency: product.currency,
                dataAmuont: product.data_amount,
                name: name,
              };
            });

            setDataPlans(dataPlans);
          }
        })
        .catch((err: any) => {
          toast.error(err.message);
        });
    }, 5000);
    debouncePhoneAndProvider();
  }, [phone, provider]);

  function getNameFromProdId(prodId: string): string {
    const match = prodId.match(/^(?:[^-]*-){3}(.*)/);
    if (!match) return "";
    const result = match[1];
    return result;
  }

  // const cartItems = useAppSelector((state) => state.cart.cartItems);
  const dispatch = useAppDispatch();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  async function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();

    try {
      const payload: CartItem = {
        phone,
        amount: plan!.denomination,
        category: "data",
        provider,
        productId: plan!.productId,
        date: new Date().getTime(),
      };
      await dispatch(addCartItem(payload));
      navigate("/checkout");
    } catch (e: any) {
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
          Buy data
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
          field={phone}
          onChange={(e) => setPhone(e.target.value)}
          title="Enter your eleven digit phone number."
          required={true}
          label="Phone Number"
        />
        <label
          htmlFor="select-plan"
          className={`w-full h-[70px] relative flex`}
        >
          <select
            onChange={(e) => setPlan(dataPlans[parseInt(e.target.value, 10)])}
            className={`text-offblack text-[16px] font-medium w-full h-full px-[24px] py-[19px] pt-[40px] bg-lightgray rounded-[16px] peer focus:outline-[#D0D5DD] ${
              plan && "border-2 border-[#D0D5DD]"
            }`}
            id="select-plan"
            defaultValue={0}
            title="Please select a data plan"
            name="select-plan"
            required
          >
            {dataPlans.map((option, index) => (
              <option
                value={index}
              >{`${option.name} for ${option.currency}${option.denomination}`}</option>
            ))}
          </select>
          <span
            className={`absolute top-1/2 left-[24px] translate-y-[-50%] peer-focus:translate-y-[-100%] ${
              plan && "translate-y-[-110%]"
            }`}
          >
            Select plan
          </span>
        </label>

        <Input
          name="email"
          id="email"
          type="email"
          field={email}
          onChange={(e) => setEmail(e.target.value)}
          title="Optionally provide an email address."
          required={false}
          label="Email Address"
        />
      </fieldset>

      <fieldset disabled={loading} className="space-y-[12px] flex flex-col">
        <PrimaryBtn title="Add to cart" type="submit" />
        <SecondaryBtn title="Proceed to checkout" type="button" />
      </fieldset>
    </form>
  );
}
