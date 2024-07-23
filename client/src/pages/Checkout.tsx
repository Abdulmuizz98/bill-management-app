import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { removeCartItem, updateCartItem } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
// import PaystackPop from "@paystack/inline-js";
import axios from "axios";
import { PaystackButton } from "react-paystack";

import {
  BmAirtime,
  BmNaira,
  BmPhone,
  BmEdit,
  BmTrash,
  BmData,
} from "../components/Icon";
import PaymentSuccessModal from "../modals/payment-success-modal";

// interface {
//   "status": true,
//   "message": "Authorization URL created",
//   "data": {
//     "authorization_url": "https://checkout.paystack.com/nkdks46nymizns7",
//     "access_code": "nkdks46nymizns7",
//     "reference": "nms6uvr1pl"
//   }
// }

function enqueueTransactions() {}

interface CartItem {
  productId: string;
  amount: number;
  date: number;
  phone: string;
  category: string;
  provider: string;
  _id?: string;
}

interface Transaction {
  amount: number;
  provider: string;
  productId: string;
  customerRef: string;
  phone: string;
  category: "airtime" | "data";
}

function prepareTransactionFromCart(
  cart: CartItem[],
  transId: string
): Transaction[] {
  const transactions: Transaction[] = [];

  cart.forEach((item) => {
    const { amount, provider, productId, phone } = item;
    let trans: Transaction = {
      amount,
      provider,
      productId,
      phone,
      customerRef: "",
      category: "airtime",
    };

    if (item.category === "airtime") {
      trans.category = "airtime";
    } else {
      trans.category = "data";
    }
    trans.customerRef = `${transId}_${item.date}`;
    transactions.push(trans);
  });

  return transactions;
}

export default function Checkout() {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const total = useAppSelector((state) => state.cart.total);
  const navigate = useNavigate();
  const gatewayFee = 0;
  const publicKey = import.meta.env.VITE_PS_KEY;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState<boolean>(false);

  // {
  //   message: "Approved";
  //   redirecturl: "?trxref=T683485942684601&reference=T683485942684601";
  //   reference: "T683485942684601";
  //   status: "success";
  //   trans: "4007339711";
  //   transaction: "4007339711";
  //   trxref: "T683485942684601";
  // }
  const componentProps = {
    email,
    amount: total * 100,
    metadata: {
      fullName,
    },
    publicKey,
    text: `Pay ₦ ${total}`,
    onSuccess: (transaction) => {
      const { trans: transId } = transaction;
      try {
        const transactions = prepareTransactionFromCart(cartItems, transId);
        const payload = { transactions: transactions };
        console.log("Payload: ", payload);
        axios
          .post(`${BASE_URL}/bills/queue-transactions`, payload)
          .then((response) => response.data)
          .then((data) => {
            console.log(data.message);
            setOpen(true);
            // TODO: Toastify here
          });
      } catch (err: any) {
        console.log(err);
        console.log("Failed to queue transactions.");
        // TODO: Toastify here
        // Really dont know what to do when it fails here... maybe refund
      }
    },
    onClose: () => alert("Wait! You need this oil, don't go!!!!"),
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // setOpen(true);
    // await handlePaywithPaystack();
  };

  const handleCancel = (e: any) => {
    navigate("/bills");
  };

  async function handleDeleteCartItem(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const cartItemId = e.currentTarget.getAttribute("data-id");
    if (cartItemId) {
      await dispatch(removeCartItem(cartItemId));
    }
  }

  async function handleEditCartItem(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    // await dispatch(updateCartItem())
  }

  function handleContinueShopping(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    navigate("/bills");
  }

  return (
    <>
      <main className="flex flex-col md:flex-row gap-6 font-sans xl:max-w-[1280px] xl:m-auto xl:px-0">
        <div className="md:flex-1">
          <div className="flex flex-col">
            <h3 className="text-[22px] text-[#101828] font-[900]">Checkout </h3>
            <span className="text-[14px] text-[#667085] ">
              Kindly review to confirm details.
            </span>
          </div>
          <div className="mt-6 w-full rounded-[12px] border-[1px] border-[#EAECF0] bg-white p-[10px] md:p-[25px] flex flex-col gap-6">
            <h5 className="text-[18px] text-[#101828] font-[900]">Your Cart</h5>
            {cartItems.map((c, index) => (
              <div
                key={c._id ?? c.date}
                className="flex items-center gap-3 rounded-[8px] border-[1px] border-[#F2F4F7] p-[12px]"
              >
                <span className="">
                  {c.category == "airtime" ? <BmAirtime /> : <BmData />}
                </span>
                <div className="flex-1 flex flex-col gap-1">
                  <p className="font-[700] text-[14px] text-[#1D2939]">
                    {`${c.provider} ${c.category}`}
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
                  <button
                    type="button"
                    title="Delete cart item"
                    onClick={handleDeleteCartItem}
                    data-id={c._id ?? c.date}
                  >
                    <BmTrash size={22} />
                  </button>
                  <button
                    type="button"
                    title="Edit cart item"
                    onClick={handleEditCartItem}
                  >
                    <BmEdit size={18} />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="w-full font-[500] text-center text-[14px] text-purple border-none outline-none"
              onClick={handleContinueShopping}
            >
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full name"
              className="rounded-[16px] border-none outline-none bg-[#F2F4F7] p-4 placeholder:text-[#667085] placeholder:font-[500] text-[14px]"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              <span className="text-[#101828] font-[700]">₦ {total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#667085]">Gateway fee</span>
              <span className="text-[#101828] font-[700]">₦ {gatewayFee}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#667085]">Total</span>
              <span className="text-[#101828] font-[700]">
                ₦ {total + gatewayFee}
              </span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="md:flex-1 w-full rounded-[40px] h-[48px] border-[1px] border-purple flex items-center justify-center text-[14px] text-purple font-[500] font-sans"
            >
              Cancel
            </button>
            <PaystackButton
              className={
                "md:flex-1 w-full rounded-[40px] h-[48px] bg-purple flex items-center justify-center text-[14px] text-white font-[500] font-sans"
              }
              {...componentProps}
            />
          </div>
        </form>
      </main>
      {open && <PaymentSuccessModal setOpen={setOpen} />}
    </>
  );
}
