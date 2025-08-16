import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ThemeState } from "@/types";

const initialState: ThemeState = {
  mode: (localStorage.getItem("theme") as "light" | "dark") || "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
      document.documentElement.classList.toggle("dark", state.mode === "dark");
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.mode = action.payload;
      localStorage.setItem("theme", state.mode);
      document.documentElement.classList.toggle("dark", state.mode === "dark");
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export { themeSlice };
