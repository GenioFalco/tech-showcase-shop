import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const SimpleNavigation = () => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Логотип */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Т</span>
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              тысяча мелочей
            </span>
          </Link>

          {/* Кнопка "На главную" */}
          <Button asChild variant="outline">
            <Link to="/">На главную</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};