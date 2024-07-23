import { useParams } from "react-router-dom";
import BillMenu from "../components/BillMenu";

export default function Bills() {
  const params = useParams();
  const { item } = params;

  return (
    <>
      <main>
        <div className="w-full max-w-[390px] p-[15px] m-auto xl:flex xl:flex-row  xl:max-w-[1280px]  gap-10">
          <div className="xl:basis-3/4 xl:border-[0.5px]  xl:border-midgray xl:rounded-[12px] xl:p-[48px]">
            <h2 className="text-[18px] pb-2 font-bold text-offblack xl:text-[20px] ">
              Pay bills with ease
            </h2>
            <p className="text-midgray text-[14px] xl:text-[16px]">
              Enjoy the convenience of paying bills with ease.
            </p>
            <BillMenu />
          </div>

          <div className="hidden xl:flex xl:flex-col gap-y-10  xl:basis-1/4 ">
            <div className="xl:border xl:border-purple basis-2/3 rounded-md">
              <img className="w-full  h-full" alt="ad one"></img>
            </div>
            <div className=" xl:border xl:border-purple basis-1/3 rounded-md">
              <img className="w-full" alt="ad one"></img>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
