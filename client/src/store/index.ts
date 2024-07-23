import { configureStore } from "@reduxjs/toolkit";
// import { composeWithDevTools } from "redux-devtools-extension";
import cartSlice from "./cartSlice";
import notificationSlice from "./notificationSlice";
import authSlice from "./authSlice";

const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    notification: notificationSlice.reducer,
    auth: authSlice.reducer,
  },
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers(),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
