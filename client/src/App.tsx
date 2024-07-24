import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Bills";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Checkout from "./pages/Checkout";
// import GuestLayout from "./layouts/GuestLayout";
import { getCart } from "./store/cartSlice";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { useEffect } from "react";
import Bills from "./pages/Bills";

function App() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  const { isAuthenticated } = auth;

  useEffect(() => {
    dispatch(getCart());
  }, [isAuthenticated]);

  return (
    <BrowserRouter>
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
