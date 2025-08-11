import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart, Menu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavigationProps {
  cartItemsCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSectionChange: (section: string) => void;
  currentSection: string;
  cartSheet: React.ReactNode;
}

export const Navigation = ({ 
  cartItemsCount, 
  searchQuery, 
  onSearchChange, 
  onSectionChange, 
  currentSection,
  cartSheet 
}: NavigationProps) => {
  const sections = [
    { id: 'home', label: 'Главная' },
    { id: 'catalog', label: 'Каталог' },
    { id: 'about', label: 'О нас' },
    { id: 'contacts', label: 'Контакты' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Логотип */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => onSectionChange('home')}
          >
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">X</span>
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              тысяча мелочей
            </span>
          </div>

          {/* Поиск - только на больших экранах */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Навигация - скрытая на мобильных */}
          <div className="hidden lg:flex items-center space-x-6">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={currentSection === section.id ? "default" : "ghost"}
                onClick={() => onSectionChange(section.id)}
                className="relative"
              >
                {section.label}
              </Button>
            ))}
          </div>

          {/* Корзина и мобильное меню */}
          <div className="flex items-center space-x-2">
            {/* Корзина */}
            {cartSheet}

            {/* Мобильное меню */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Меню</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {/* Мобильный поиск */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Поиск товаров..."
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Мобильная навигация */}
                  <div className="space-y-2">
                    {sections.map((section) => (
                      <Button
                        key={section.id}
                        variant={currentSection === section.id ? "default" : "ghost"}
                        onClick={() => onSectionChange(section.id)}
                        className="w-full justify-start"
                      >
                        {section.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};