import { ReactNode } from "react";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import NewsLetterForm from "../components/NewsLetterForm";

interface GuestLayoutProps {
  children: ReactNode;
}

const GuestLayout = ({ children }: GuestLayoutProps) => {
  return (
    <div>
      <TopNav/>
      <div className="p-[20px] md:px-[50px] md:py-[30px] lg:px-[65px] bg-[#f9fafb]">
      {children}

      </div>
      <NewsLetterForm/>
      <Footer/>
    </div>
  );
};

export default GuestLayout;
