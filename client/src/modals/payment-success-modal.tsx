import { FaCircleCheck } from "react-icons/fa6";
import { IoDocumentTextOutline } from "react-icons/io5";
import { LuFileX } from "react-icons/lu";

const PaymentSuccessModal = ({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) => {

    const handleClose = () => {
        setOpen(false);
      };
    
      const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
      };

      
  return (
    <div  onClick={handleClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div onClick={handleModalClick} className="bg-white rounded-t-[12px] p-6 w-[90vw] md:w-[380px] text-center flex flex-col gap-6 zigzag-botto relative">
        <div className="absolute w-full -top-[7%] flex justify-center left-0">
            <div className="rounded-[50%] shadow-md w-[55px] h-[55px] flex items-center justify-center  relative bg-white z-10 text-purple">
                <FaCircleCheck size={30}/>
            </div>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <h2 className="text-[#101828] font-[900] text-[20px]">
            Payment Successful
          </h2>
          <p className="text-[#667085] text-[14px] ">
            Your payment has been successfully done.
          </p>
        </div>
        <div className="border-[1px] border-[#F2F4F7]"></div>
        <div className="flex flex-col gap-1 items-center">
          <p className="text-[#667085] text-[14px] ">Total Payment</p>
          <h2 className="text-[#101828] font-[900] text-[16px]">NGN 4850</h2>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-[6px] border-[1px] border-[#EAECF0]  p-[10px] flex flex-col gap-1  text-[12px] items-start">
            <p className="text-[#667085] ">Product name</p>
            <h2 className="text-[#1D2939] font-[700]">Airtel Airtime</h2>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 rounded-[6px] border-[1px] border-[#EAECF0]  p-[10px] flex flex-col gap-1  text-[12px] items-start">
              <p className="text-[#667085] ">Transaction date</p>
              <h2 className="text-[#1D2939] font-[900]">02 Mar 21 / 2:87AM</h2>
            </div>
            <div className="flex-1 rounded-[6px] border-[1px] border-[#EAECF0]  p-[10px] flex flex-col gap-1  text-[12px] items-start">
              <p className="text-[#667085] ">Payment Method</p>
              <h2 className="text-[#1D2939] font-[900]">Mono</h2>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-center">
          <p className="text-[#667085] text-[12px] ">
            Kindly check your mail for package and receipt
          </p>
          <p className="text-[#667085] text-[14px] ">
            <a href="#" className="font-[500] text-purple">
              Click here
            </a>{" "}
            to download again
          </p>
        </div>
        <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-1 text-[12px] text-[#667085] font-[700] font-sans">
                <IoDocumentTextOutline size={20}/>
                <span>Get PDF Receipt</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 text-[12px] text-[#A92F34] font-[700] font-sans">
                <LuFileX size={20}/>
                <span>Report dispute</span>
            </button>
        </div>
        {/* <div className="h-[20px]"></div> */}
      </div>
    </div>
  );
};

export default PaymentSuccessModal;
