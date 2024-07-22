import { CiFacebook } from "react-icons/ci";
import { FaDribbble } from "react-icons/fa6";
import { LuYoutube } from "react-icons/lu";

const Footer = () => {
  return (
    <div className="bg-purple py-[30px] md:px-[80px] hidden md:flex flex-col gap-14 text-[#EFEAFD] font-sans">
      <div className="flex gap-[60px] lg:gap-[150px]">
        <div className="basis-[30%]  text-[15px] font-[500]">
          Lorem ipsum dolor sit amet consectetur. Gravida bibendum interdum vel
          vivamus dignissim consectetur enim in. Ultricies accumsan egestas
          ultrices mi adipiscing ultrices ornare. Mauris elementum accumsan
          elementum rhoncus risus sed.
        </div>
        <div className="flex-1 grid grid-cols-4">
          <div className="flex flex-col gap-4">
            <p className="text-[16px] font-[900]">Company</p>
            <a href="#">
              <span className="text-[14px]">About us</span>
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[16px] font-[900]">Explore</p>
            <a href="#">
              <span className="text-[14px]">Marketplace</span>
            </a>
            <a href="#">
              <span className="text-[14px]">Sample storefront</span>
            </a>
            <a href="#">
              <span className="text-[14px]">Bills payment</span>
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[16px] font-[900]">Legal</p>
            <a href="#">
              <span className="text-[14px]">Privacy note</span>
            </a>
            <a href="#">
              <span className="text-[14px]">Terms and condition </span>
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[16px] font-[900]">Contact us</p>
            <div className="flex items-center gap-4 text-[24px]">
              <a href="#">
                <CiFacebook />
              </a>
              <a href="#">
                <LuYoutube />
              </a>
              <a href="#">
                <FaDribbble />
              </a>
            </div>
            <span className="text-[14px]">This address</span>
            <span className="text-[14px]">info@xyz.com</span>
            <span className="text-[14px]">000 0000 0000</span>
          </div>
        </div>
      </div>
      <p className="text-[14px] font-[500] text-center text-whit">
        &copy; 2000-2021, All Rights Reserved
      </p>
    </div>
  );
};

export default Footer;
