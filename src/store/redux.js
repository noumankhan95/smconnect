import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./authreducer";
const store = configureStore({
  reducer: {
    authreducer,
  },
});
export default store;
