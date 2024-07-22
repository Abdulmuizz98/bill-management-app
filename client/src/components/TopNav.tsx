import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LiaTimesCircle, LiaTimesSolid } from "react-icons/lia";
import { CgMenuRightAlt } from "react-icons/cg";
import { IoCartOutline } from "react-icons/io5";
import { TfiHeart } from "react-icons/tfi";
import { SlMenu } from "react-icons/sl";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface INavOption {
  text: string;
  link: string;
  children?: INavOption[];
}

const TopNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Define your nav options here
  const navOptions: INavOption[] = [
    {
      text: "Home",
      link: "/",
    },
    {
      text: "Market place",
      link: "#",
      children: [
        { text: "All Categories", link: "#" },
        { text: "Books", link: "#" },
        { text: "Events", link: "#" },
        { text: "Design", link: "#" },
        { text: "Personal development", link: "#" },
        { text: "Business", link: "#" },
        { text: "Arts", link: "#" },
        { text: "Bills Payment", link: "#" },
      ],
    },
    {
      text: "Bills Payments",
      link: "#",
    },
    {
      text: "FAQs",
      link: "#",
    },
    {
      text: "Contact",
      link: "#",
    },
  ];

  // Find the active route
  const activeNavOption = navOptions.find(
    (option) => option.link === location.pathname
  );
  const activeChildren = navOptions[1]?.children || [];

  const handleNavClick = (link: string) => {
    if (link === "#") {
      // If the link is #, toggle the collapsible items
      setExpandedItem(expandedItem === link ? null : link);
    } else {
      // Navigate to the route
      navigate(link);
      setIsNavOpen(false); // Close the menu
    }
  };

  const handleBackdropClick = () => {
    setIsNavOpen(false);
  };

  return (
    <nav className="">
      <div className="bg-white py-[20px] px-[20px] md:px-[80px] flex lg:gap-[50px] items-center justify-between lg:justify-normal font-sans">
        <a href="/" className=" hidden lg:block">
          <span className="text-[30px] font-[900]">Logo</span>
        </a>
        <div className="flex-1 hidden lg:flex items-center justify-end gap-10 ">
          {navOptions.map((n, index) => (
            <a
              href={n.link}
              key={index * 73}
              className={`text-[16px] ${
                location.pathname === n.link
                  ? " text-[#2A3342]"
                  : "text-[#556987]"
              }`}
            >
              {n.text}
            </a>
          ))}
        </div>
        <div className=" hidden lg:flex flex-col md:flex-row gap-3">
          <button
            onClick={() => navigate("/signin")}
            type="button"
            className="md:flex-1 w-[140px] rounded-[40px] h-[48px] border-[1px] border-purple flex items-center justify-center text-[14px] text-purple font-[500] font-sans"
          >
            Sign in
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="md:flex-1 w-[140px] rounded-[40px] h-[48px] bg-purple flex items-center justify-center text-[14px] text-white font-sans"
          >
            Create account
          </button>
        </div>
        <button
          onClick={() => setIsNavOpen(true)}
          className="lg:hidden text-[30px] md:text-[40px]"
        >
          <SlMenu size={17} />
        </button>
        <button
          type="button"
          onClick={() => navigate("/checkout")}
          className="lg:hidden w-[36px] rounded-[50%] h-[36px] border-[1px] border-[#CFC0F9] text-[#667085] flex items-center justify-center  font-[500] font-sans relative"
        >
          <IoCartOutline size={16} />
          <div className="absolute bg-purple w-[12px] h-[12px] rounded-[50%] flex items-center justify-center text-[5px] text-white font-[700] top-1 right-1">
            2
          </div>
        </button>
        <div
          className={`lg:hidden fixed top-0 left-0 w-full h-full bg-black opacity-50 z-20 ${
            isNavOpen ? "block" : "hidden"
          }`}
          onClick={handleBackdropClick}
        />
        <div
          className={`lg:hidden fixed top-0 transition-all duration-300 bg-[white] flex flex-col items-center gap-14 py-[20px] md:pt-[40px] w-[280px] h-[100vh] z-30 overflow-x-auto ${
            isNavOpen ? "left-0" : "-left-[280px]"
          }`}
        >
          <div className="flex items-center justify-between w-full px-[20px]">
            <a href="/" className=" ">
              <span className="text-[20px] font-[900]">Logo</span>
            </a>
            <button
              onClick={() => setIsNavOpen(false)}
              className=" text-[24px] text-[#D0D5DD]"
            >
              <LiaTimesCircle />
            </button>
          </div>
          <div className="flex-1 flex flex-col  gap-3 w-full">
            {navOptions.map((n, index) => (
              <div key={index * 73} className="w-full">
                <button
                  onClick={() => handleNavClick(n.link)}
                  className={`text-[16px] text-start w-full px-[30px] py-[10px] font-[500] flex justify-between items-center ${
                    location.pathname === n.link
                      ? "text-purple bg-[#EFEAFD] border-l-2 border-purple"
                      : "text-[#667085]"
                  }`}
                >
                  {n.text}
                  {n.children && (
                    <div>
                      {expandedItem === n.link ? (
                        <IoIosArrowUp size={20} />
                      ) : (
                        <IoIosArrowDown size={20} />
                      )}
                    </div>
                  )}
                </button>
                {n.children && expandedItem === n.link && (
                  <div className="pl-2 mt-1 flex flex-col items-start gap-3 w-full">
                    {n.children.map((child, childIndex) => (
                      <button
                        key={childIndex}
                        onClick={() => handleNavClick(child.link)}
                        className={`text-[14px] w-full px-[30px] text-start ${
                          location.pathname === child.link ? "underline" : ""
                        }`}
                      >
                        {child.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className=" flex flex-col gap-4 px-[20px] w-full">
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="w-full rounded-[40px] h-[48px] border-[1px] border-purple flex items-center justify-center text-[14px] text-purple font-[500] font-sans"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-full rounded-[40px] h-[48px] bg-purple flex items-center justify-center text-[14px] text-white font-sans"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex bg-[#FCFCFD] border-[1px] border-[#EAECF0] py-[20px] px-[20px] md:px-[80px] gap-7 items-center justify-end">
        {activeChildren.length > 0 &&
          activeChildren.map((child, index) => (
            <a
              key={index}
              href={child.link}
              className="text-[#1D2939] text-[14px] font-[700]"
            >
              {child.text}
            </a>
          ))}
        <button
          type="button"
          className="w-[48px] rounded-[50%] h-[48px] border-[1px] border-purple flex items-center justify-center text-purple font-[500] font-sans"
        >
          <TfiHeart size={20} />
        </button>
        <button
          onClick={() => navigate("/checkout")}
          className=" w-[155px] rounded-[40px] h-[48px] bg-purple flex items-center justify-center text-[14px] text-white font-sans gap-2"
        >
          <IoCartOutline size={20} />
          <span>My cart</span>
          <div className="bg-white w-[20px] h-[20px] rounded-[50%] flex items-center justify-center text-[10px] text-purple font-[900]">
            2
          </div>
        </button>
      </div>
    </nav>
  );
};

export default TopNav;
