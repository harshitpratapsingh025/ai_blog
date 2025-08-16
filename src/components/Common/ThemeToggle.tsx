import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/store/slices/themeSlice";
import type { RootState } from "@/store";
import { Button } from "@/components/ui/button";

export const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.mode);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => dispatch(toggleTheme())}
      className="bg-muted hover:bg-muted/80"
    >
      {theme === "dark" ? (
        <i className="fas fa-sun text-yellow-400" />
      ) : (
        <i className="fas fa-moon text-gray-600" />
      )}
    </Button>
  );
};
