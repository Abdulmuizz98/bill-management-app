import { useParams } from "react-router-dom";
import BillMenu from "../components/BillMenu";

export default function Bills() {
  const params = useParams();
  const { item } = params;

  return (
    <>
      <main>
        <div className="w-full max-w-[390px] p-[15px] m-auto  border border-black xl:flex xl:flex-row  xl:max-w-[1280px]  gap-10">
          <div className="xl:basis-3/4 xl:border xl:border-midgray xl:rounded-[12px]">
            <h2 className="text-[18px] pb-2 font-bold text-offblack xl:text-[20px]">
              Pay bills with ease
            </h2>
            <p className="text-midgray text-[14px] xl:text-[16px]">
              Enjoy the convenience of paying bills with ease.
            </p>
            <BillMenu />
          </div>

          <div className="hidden xl:flex xl:basis-1/4  border border-red-600">
            <div className=""></div>
            <div className=""></div>
          </div>
        </div>
      </main>
    </>
  );
}
