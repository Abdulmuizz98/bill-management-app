import BillMenu from "../components/BillMenu";
import { useState, useEffect } from "react";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import NewsLetterForm from "../components/NewsLetterForm";
import { getCart } from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
interface Ad {
  imgSrc: string;
  link: string;
}

const ads: Ad[] = [
  { imgSrc: `https://picsum.photos/seed/picsum1/200/200`, link: "#" },
  { imgSrc: `https://picsum.photos/seed/picsum2/200/200`, link: "#" },
  { imgSrc: `https://picsum.photos/seed/picsum3/200/200`, link: "#" },
];

export default function Bills() {
  const [adIndex, setAdIndex] = useState(0);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const redirectToLogin = useAppSelector((state) => state.auth.redirectToLogin);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const timerId = setTimeout(() => {
      setAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // Change ad after 5 seconds

    return () => {
      clearTimeout(timerId);
    };
  }, []);

  console.log("adIndex: ", adIndex);
  useEffect(() => {
    dispatch(getCart());

    // Fix for redirect to sign in if user is logged out.
    if (!isAuthenticated && redirectToLogin) {
      navigate("/signin");
    }
  }, [isAuthenticated]);

  return (
    <>
      <TopNav />
      <main>
        <div className="w-full max-w-[390px] p-[15px] m-auto xl:flex xl:flex-row  xl:max-w-[1280px]  gap-10">
          <div className="xl:basis-3/4 xl:border-[0.5px]  xl:border-[#EAECF0] xl:rounded-[12px] xl:p-[48px]">
            <h2 className="text-[18px] pb-2 font-bold text-offblack xl:text-[20px] ">
              Pay bills with ease
            </h2>
            <p className="text-midgray text-[14px] xl:text-[16px]">
              Enjoy the convenience of paying bills with ease.
            </p>
            <BillMenu />
          </div>

          <div className="hidden xl:flex xl:object-contain xl:flex-col gap-y-10 xl:basis-1/4 ">
            <a href={ads[adIndex].link}>
              <img
                className="w-full rounded-md xl:h-[600px]"
                alt="ad one"
                src={ads[adIndex].imgSrc}
              ></img>
            </a>
            <a href={ads[adIndex].link}>
              <img
                className="w-full rounded-md xl:h-[200px]"
                alt="ad one"
                src={ads[adIndex].imgSrc}
              ></img>
            </a>
          </div>
        </div>
      </main>
      <NewsLetterForm />
      <Footer />
    </>
  );
}
