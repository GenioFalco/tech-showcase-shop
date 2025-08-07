import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Truck } from "lucide-react";

interface HeroSectionProps {
  onShopNow: () => void;
}

export const HeroSection = ({ onShopNow }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center text-white">
          <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
            ✨ Новинки каждую неделю
          </Badge>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            x-brand магазин
            <br />
            <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              всех товаров
            </span>
          </h1>
          
          <p className="mb-8 text-xl text-blue-100 lg:text-2xl">
            Универсальный интернет-магазин для дома, спорта, красоты и электроники. 
            Качество, доставка и гарантия на все!
          </p>
          
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              size="lg" 
              onClick={onShopNow}
              className="bg-white text-primary hover:bg-gray-100 shadow-button font-semibold"
            >
              Перейти в каталог
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              Связаться с нами
            </Button>
          </div>
          
          {/* Преимущества */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-white/20 p-3">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">Быстрая доставка</h3>
              <p className="text-sm text-blue-100">До 2 дней по всей России</p>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-white/20 p-3">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">Гарантия качества</h3>
              <p className="text-sm text-blue-100">Официальная гарантия</p>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-white/20 p-3">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold">Бесплатная доставка</h3>
              <p className="text-sm text-blue-100">От 3000 ₽</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Декоративные элементы */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
    </section>
  );
};