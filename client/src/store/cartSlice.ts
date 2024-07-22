import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { ERROR, notify } from "./notificationSlice";
import { getConfig } from "./authSlice";
import { logout } from "./authSlice";

const endpoint = "http://localhost:3000/cart";

// Define an async thunk action creator
export const getCart = createAsyncThunk(
  "cart/getCart",
  async (_, { dispatch, getState }) => {
    const isAuthenticated = getState().auth.isAuthenticated;
    const user = getState().auth.user;

    if (!isAuthenticated && !user) {
      const cartData = localStorage.getItem("bma-cart") || "[]";
      const cart = JSON.parse(cartData) as CartItem[];
      return { cart: cart };
    } else {
      try {
        const response = await axios.get(endpoint, getConfig(user.token));
        return { cart: response.data };
      } catch (err: any) {
        if (err.response.status === 403) {
          dispatch(logout());
        }
        const payload = {
          msg: err.response.data,
          status: err.response.status,
          type: ERROR,
        };
        dispatch(notify(payload));
        throw err;
      }
    }
  }
);

export const addCartItem = createAsyncThunk(
  "cart/addCartItem",
  async (cartItem: CartItem, { dispatch, getState }) => {
    const isAuthenticated = getState().auth.isAuthenticated;
    const user = getState().auth.user;

    if (!isAuthenticated && !user) {
      const cartData = localStorage.getItem("bma-cart") || "[]";
      const cart = JSON.parse(cartData) as CartItem[];
      cart.push(cartItem);
      localStorage.setItem("bma-cart", JSON.stringify(cart));
      return { cartItem: cartItem };
    } else {
      try {
        const response = await axios.post(
          endpoint,
          cartItem,
          getConfig(user.token)
        );
        return { cartItem: response.data };
      } catch (err: any) {
        if (err.response.status === 403) {
          dispatch(logout());
        }
        const payload = {
          msg: err.response.data,
          status: err.response.status,
          type: ERROR,
        };
        dispatch(notify(payload));
        throw err;
      }
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (updateItem: CartItem, { dispatch, getState }) => {
    const isAuthenticated = getState().auth.isAuthenticated;
    const user = getState().auth.user;

    if (!isAuthenticated && !user) {
      const cartData = localStorage.getItem("bma-cart") || "[]";
      const cart = JSON.parse(cartData) as CartItem[];
      const cartItem = cart.find((item) => item.date === updateItem.date);
      if (cartItem) {
        Object.assign(cartItem, updateItem);
        localStorage.setItem("bma-cart", JSON.stringify(cart));
        return { updatedItem: cartItem };
      }
    } else {
      try {
        const response = await axios.put(
          `${endpoint}/${updateItem._id}`,
          updateItem
          getConfig(user.token)
        );
        return { updatedItem: response.data};
      } catch (err: any) {
        if (err.response.status === 403) {
          dispatch(logout());
        }
        const payload = {
          msg: err.response.data,
          status: err.response.status,
          type: ERROR,
        };
        dispatch(notify(payload));
        throw err;
      }
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (cartItemId: string | Date, { dispatch, getState }) => {
    const isAuthenticated = getState().auth.isAuthenticated;
    const user = getState().auth.user;

    if (!isAuthenticated && !user) {
      const cartData = localStorage.getItem("bma-cart") || "[]";
      const cart = JSON.parse(cartData) as CartItem[];
      const cartItemIndex = cart.findIndex((item) => item.date === cartItemId);
      if (cartItemIndex > 0) {
        cart.splice(cartItemIndex);
        localStorage.setItem("bma-cart", JSON.stringify(cart));
        return;
      }
    } else {
      try {
        const response = await axios.delete(
          `${endpoint}/${cartItemId}`,
          getConfig(user.token)
        );
        return response.data;
      } catch (err: any) {
        if (err.response.status === 403) {
          dispatch(logout());
        }
        const payload = {
          msg: err.response.data,
          status: err.response.status,
          type: ERROR,
        };
        dispatch(notify(payload));
        throw err;
      }
    }
  }
);

interface CartItem {
  productId: string;
  amount: number;
  date: Date;
  phone: string;
  category: string;
  provider: string;
  _id?: string;
}

interface CartStateInterface {
  cartItems: CartItem[];
  loading: boolean;
  error: string | undefined;
}

const initialState: CartStateInterface = {
  cartItems: [],
  loading: false,
  error: "",
};
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    viewCart: (state, action: PayloadAction<any>) => {
      state.cartItems = action.payload.items;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.pixels = action.payload.pixels;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCartItem.fulfilled, (state, action) => {
        state.loading = false;
        // state.pixels.push(action.payload);
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;

      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// export const { viewCart } = cartSlice.actions;
export default cartSlice;
