import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Bills";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Checkout from "./pages/Checkout";
// import GuestLayout from "./layouts/GuestLayout";
import { resetError } from "./store/authSlice";
import Bills from "./pages/Bills";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useEffect } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (auth.error) {
      toast.error(auth.error);
      dispatch(resetError());
    }
  }, [auth.error, dispatch]);

  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/bills" element={<Bills />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
