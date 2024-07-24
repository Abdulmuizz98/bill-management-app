import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { getCart } from "../store/cartSlice";

export default function Home() {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    navigate("/bills", { replace: true });
  }, []);

  useEffect(() => {
    dispatch(getCart());

    // Fix for redirect to sign in if user is logged out.
    if (!isAuthenticated) {
      navigate("/signin");
    }
  }, [isAuthenticated]);

  return <div></div>;
}
