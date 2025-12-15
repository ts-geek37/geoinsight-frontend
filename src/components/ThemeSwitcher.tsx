import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border/40 bg-secondary/40 p-1">
      <button
        onClick={() => setTheme("light")}
        className={cn(
          "p-2 rounded-md transition-colors",
          theme === "light"
            ? "bg-segment-opportunity text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Sun className="h-4 w-4" />
      </button>

      <button
        onClick={() => setTheme("dark")}
        className={cn(
          "p-2 rounded-md transition-colors",
          theme === "dark"
            ? "bg-segment-opportunity text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Moon className="h-4 w-4" />
      </button>

      <button
        onClick={() => setTheme("system")}
        className={cn(
          "p-2 rounded-md transition-colors",
          theme === "system"
            ? "bg-segment-opportunity text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
