import { HiOutlineMail } from "react-icons/hi";

const NewsLetterForm = () => {
  return (
    <div className="hidden md:flex bg-[#f9fafb] flex-col gap-4 font-sans items-center py-[60px] px-[20px]">
      <h3 className="text-[24px] text-[#101828] font-[900]">Newsletter</h3>
      <span className="text-center text-[14px] text-[#475467] leading-[20px] whitespace-pre-line">
        {
          "Be the first one to know  about discounts, offers and events weekly in your \nmailbox. Unsubscribe whenever you like with one click."
        }
      </span>
      <form className="overflow-hidden mt-3 w-[60%] rounded-[40px] border-[1px] border-[#98A2B3] p-1 h-[64px] flex items-center  gap-2">
        <div className="ml-4">
          <HiOutlineMail size={25} color="#667085" />
        </div>
        <input
          type="email"
          required
          placeholder="Enter your email"
          className="flex-1 border-none outline-none placeholder:text-[#667085] bg-[inherit] text-[15px]"
        />
        <button className="w-[130px] rounded-[30px] h-full bg-[#DFD5FB] flex items-center justify-center text-[14px] text-purple font-sans font-[500]">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewsLetterForm;
