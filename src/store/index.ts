import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootSlice";
import resourceFormReducer from "./resourceFormSlice";
const store = configureStore({
  reducer: {
    root: rootReducer,
    resourceForm: resourceFormReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;

