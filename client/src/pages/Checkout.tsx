import { useState } from "react";
import {
  BmAirtime,
  BmNaira,
  BmPhone,
  BmEdit,
  BmTrash,
  BmData,
} from "../components/Icon";
import PaymentSuccessModal from "../modals/payment-success-modal";

interface CartItem {
  category: string; // This will determine icons
  item: string;
  phone: string;
  amount: number;
  plan?: string;
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([
    {
      category: "airtime",
      item: "MTN Airtime",
      phone: "123-456-7890",
      amount: 2000,
    },
    {
      category: "data",
      item: "MTN Data",
      phone: "234-567-8901",
      amount: 1000,
      plan: "5GB",
    },
    {
      category: "airtime",
      item: "Airtime Top-up",
      phone: "345-678-9012",
      amount: 3000,
    },
    {
      category: "data",
      item: "Data Package",
      phone: "456-789-0123",
      amount: 15000,
      plan: "10GB",
    },
    {
      category: "airtime",
      item: "Airtime Top-up",
      phone: "567-890-1234",
      amount: 25,
    },
  ]);
  const [open, setOpen] = useState<boolean>(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setOpen(true);
  };
  return (
    <>
      <main className="flex flex-col md:flex-row gap-6 font-sans">
        <div className="md:flex-1">
          <div className="flex flex-col">
            <h3 className="text-[22px] text-[#101828] font-[900]">Checkout </h3>
            <span className="text-[14px] text-[#667085] ">
              Kindly review to confirm details.
            </span>
          </div>
          <div className="mt-6 w-full rounded-[12px] border-[1px] border-[#EAECF0] bg-white p-[10px] md:p-[25px] flex flex-col gap-6">
            <h5 className="text-[18px] text-[#101828] font-[900]">Your Cart</h5>
            {cart.map((c, index) => (
              <div
                key={c.item}
                className="flex items-center gap-3 rounded-[8px] border-[1px] border-[#F2F4F7] p-[12px]"
              >
                <span className="">
                  {c.category == "airtime" ? <BmAirtime /> : <BmData />}
                </span>
                <div className="flex-1 flex flex-col gap-1">
                  <p className="font-[700] text-[14px] text-[#1D2939]">
                    {c.item}
                  </p>
                  <div className="flex flex-col md:flex-row gap-2 md:gap-x-4">
                    <span className="flex items-center gap-x-2">
                      <BmPhone size={14} />
                      <span className="text-[12px] text-[#667085]">
                        {c.phone}
                      </span>
                    </span>
                    <span className="flex item-center gap-x-1">
                      <BmNaira size={14} />
                      <span className="text-[12px] text-[#667085]">
                        ₦{c.amount.toLocaleString()}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-x-3 ">
                  <BmTrash size={22} />
                  <BmEdit size={18} />
                </div>
              </div>
            ))}
            <button className="w-full font-[500] text-center text-[14px] text-purple border-none outline-none">
              Continue Shopping
            </button>
          </div>
        </div>
        <form
          onSubmit={handleSubmit}
          action=""
          className="md:flex-1 rounded-[12px] border-[1px] border-[#EAECF0] bg-white p-[15px] md:p-[25px] flex flex-col gap-6"
        >
          <div className="flex flex-col ">
            <h3 className="text-[22px] text-[#101828] font-[700]">
              Contact information{" "}
            </h3>
            <span className="text-[14px] text-[#667085] ">
              Please provide your best email
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <input
              required
              type="text"
              placeholder="Full name"
              className="rounded-[16px] border-none outline-none bg-[#F2F4F7] p-4 placeholder:text-[#667085] placeholder:font-[500] text-[14px]"
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="rounded-[16px] border-none outline-none bg-[#F2F4F7] p-4 placeholder:text-[#667085] placeholder:font-[500] text-[14px]"
            />
          </div>
          <div>
            <div className="flex flex-col ">
              <h3 className="text-[22px] text-[#101828] font-[700]">
                Select payment option
              </h3>
              <span className="text-[14px] text-[#667085] ">
                Choose your preferred payment method
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              <div className="flex rounded-[8px] border-[1px] border-[#EAECF0] p-4">
                <label
                  htmlFor="paystack"
                  className="flex-1 flex gap-3 items-center text-[14px]"
                >
                  <img
                    alt="paystack logo"
                    src="/images/paystack.png"
                    width={35}
                    height={35}
                  />
                  <h3 className=" text-[#101828] font-[500]">
                    Pay with Paystack
                  </h3>
                </label>
                <input required type="radio" name="payment" id="paystack" />
              </div>
              <div className="flex rounded-[8px] border-[1px] border-[#EAECF0] p-4">
                <label
                  htmlFor="pay"
                  className="flex-1 flex flex-col text-[14px]"
                >
                  <h3 className=" text-[#101828] font-[500]">
                    Buy Now Pay Later
                  </h3>
                  <span className=" text-[#667085] ">
                    Enjoy 6-Month Installments with Zero Interest
                  </span>
                </label>
                <input required type="radio" name="payment" id="pay" />
              </div>
              <div className="flex rounded-[8px] border-[1px] border-[#EAECF0] p-4">
                <label
                  htmlFor="generate"
                  className="flex-1 flex flex-col text-[14px]"
                >
                  <h3 className=" text-[#101828] font-[500]">
                    Generate Payment Link
                  </h3>
                  <span className=" text-[#667085] ">
                    Simply send them a link, and let the generosity flow!
                  </span>
                </label>
                <input required type="radio" name="payment" id="generate" />
              </div>
            </div>
          </div>
          <div className="border-t-[1px] border-[#F2F4F7]"></div>
          <div className="flex flex-col gap-3 text-[14px]">
            <div className="flex justify-between items-center">
              <span className="text-[#667085]">Sub total</span>
              <span className="text-[#101828] font-[700]">₦1,700</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#667085]">Gateway fee</span>
              <span className="text-[#101828] font-[700]">₦1,700</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#667085]">Total</span>
              <span className="text-[#101828] font-[700]">₦1,700</span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <button
              type="button"
              className="md:flex-1 w-full rounded-[40px] h-[48px] border-[1px] border-purple flex items-center justify-center text-[14px] text-purple font-[500] font-sans"
            >
              Cancel
            </button>
            <button className="md:flex-1 w-full rounded-[40px] h-[48px] bg-purple flex items-center justify-center text-[14px] text-white font-[500] font-sans">
              Pay ₦1,700
            </button>
          </div>
        </form>
      </main>
      {open && <PaymentSuccessModal setOpen={setOpen} />}
    </>
  );
}
