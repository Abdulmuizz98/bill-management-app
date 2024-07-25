import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ERROR, notify } from "./notificationSlice";
import { getConfig } from "./authSlice";
import { logout } from "./authSlice";
import { CartItem } from "../types";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const endpoint = `${BASE_URL}/cart`;

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
        if (err.response.status === 401 || err.response.status === 403) {
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
        console.log(response.data);
        return { cartItem: response.data };
      } catch (err: any) {
        if (err.response.status === 401 || err.response.status === 403) {
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
          updateItem,
          getConfig(user.token)
        );
        return { updatedItem: response.data };
      } catch (err: any) {
        if (err.response.status === 401 || err.response.status === 403) {
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
  async (cartItemId: string | number, { dispatch, getState }) => {
    const isAuthenticated = getState().auth.isAuthenticated;
    const user = getState().auth.user;

    if (!isAuthenticated && !user) {
      const cartData = localStorage.getItem("bma-cart") || "[]";
      const cart = JSON.parse(cartData) as CartItem[];

      const cartItemIndex = cart.findIndex(
        (item) => item.date === Number(cartItemId)
      );

      if (cartItemIndex > -1) {
        const removedItem = cart.splice(cartItemIndex, 1)[0];
        localStorage.setItem("bma-cart", JSON.stringify(cart));

        return { removedItem: removedItem };
      }
    } else {
      try {
        const response = await axios.delete(
          `${endpoint}/${cartItemId}`,
          getConfig(user.token)
        );
        return { removedItem: response.data };
      } catch (err: any) {
        if (err.response.status === 401 || err.response.status === 403) {
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

export const checkout = createAsyncThunk(
  "cart/checkout",
  async (_, { dispatch, getState }) => {
    const isAuthenticated = getState().auth.isAuthenticated;
    const user = getState().auth.user;

    if (!isAuthenticated && !user) {
      localStorage.setItem("bma-cart", "[]");
      return;
    } else {
      try {
        await axios.delete(`${endpoint}`, getConfig(user.token));
        return;
      } catch (err: any) {
        if (err.response.status === 401 || err.response.status === 403) {
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

interface CartStateInterface {
  cartItems: CartItem[];
  loading: boolean;
  error: string | undefined;
  total: number;
}

const initialState: CartStateInterface = {
  cartItems: [],
  loading: false,
  error: "",
  total: 0,
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
        state.cartItems = action.payload.cart;
        state.total = state.cartItems.reduce(
          (acc, item) => acc + item.amount,
          0
        );
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
        state.cartItems.push(action.payload.cartItem);
        // state.total = state.cartItems.reduce((acc, item) => acc + item.amount, 0);
        state.total += action.payload.cartItem.amount;
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload?.updatedItem;
        const { _id } = updatedItem;
        const dateId = updatedItem.date; // For non-auth users
        let index = -1;

        if (_id) {
          index = state.cartItems.findIndex((item) => item._id === _id);
        } else {
          index = state.cartItems.findIndex((item) => item.date === dateId);
        }

        if (index !== -1) {
          state.total += updatedItem.amount - state.cartItems[index].amount;
          Object.assign(state.cartItems[index], updatedItem);
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const removedItem: CartItem = action.payload?.removedItem;
        const { _id } = removedItem;
        const dateId = removedItem.date; // For non-auth users

        state.total -= action.payload?.removedItem.amount;

        if (_id) {
          state.cartItems = state.cartItems.filter((item) => item._id !== _id);
        } else {
          state.cartItems = state.cartItems.filter(
            (item) => item.date !== dateId
          );
        }
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(checkout.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkout.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
        state.total = 0;
      })
      .addCase(checkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// export const { viewCart } = cartSlice.actions;
export default cartSlice;
