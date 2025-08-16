import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { setTheme } from "@/store/slices/themeSlice";

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    // Initialize theme on app start
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" || "light";
    dispatch(setTheme(savedTheme));
  }, [dispatch]);

  return theme;
};
