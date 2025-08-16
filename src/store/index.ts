import { configureStore } from "@reduxjs/toolkit";
import { postsSlice } from "./slices/postsSlice";
import { themeSlice } from "./slices/themeSlice";
import { aiSlice } from "./slices/aiSlice";

export const store = configureStore({
  reducer: {
    posts: postsSlice.reducer,
    theme: themeSlice.reducer,
    ai: aiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
