import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-12 w-12 rounded-xl border border-slate-200/50 dark:border-slate-600/50 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur-sm group relative overflow-hidden"
      data-testid="button-theme-toggle"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 relative z-10" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 relative z-10" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}