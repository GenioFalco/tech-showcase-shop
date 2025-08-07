import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Instagram,
  MapPin,
  Shield,
  FileText,
  Users
} from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleTelegramContact = () => {
    window.open('https://t.me/technomarket_support', '_blank');
  };

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/79999999999', '_blank');
  };

  const handleInstagramContact = () => {
    window.open('https://instagram.com/technomarket_official', '_blank');
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* О компании */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Т</span>
              </div>
              <span className="text-xl font-bold">ТехноМаркет</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Качественная электроника и аксессуары по выгодным ценам. 
              Работаем по всей России уже более 5 лет.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                5+ лет на рынке
              </Badge>
              <Badge variant="outline" className="text-xs">
                10K+ клиентов
              </Badge>
            </div>
          </div>

          {/* Контакты */}
          <div className="space-y-4">
            <h3 className="font-semibold">Контакты</h3>
            <div className="space-y-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleTelegramContact}
                className="justify-start p-0 h-auto text-left"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Telegram
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleWhatsAppContact}
                className="justify-start p-0 h-auto text-left"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleInstagramContact}
                className="justify-start p-0 h-auto text-left"
              >
                <Instagram className="w-4 h-4 mr-2" />
                Instagram
              </Button>
              <div className="flex items-center text-sm text-muted-foreground">
                <Phone className="w-4 h-4 mr-2" />
                +7 (999) 999-99-99
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="w-4 h-4 mr-2" />
                info@technomarket.ru
              </div>
            </div>
          </div>

          {/* Информация */}
          <div className="space-y-4">
            <h3 className="font-semibold">Информация</h3>
            <div className="space-y-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start p-0 h-auto text-left"
              >
                <Shield className="w-4 h-4 mr-2" />
                Гарантия
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start p-0 h-auto text-left"
              >
                <FileText className="w-4 h-4 mr-2" />
                Доставка и оплата
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start p-0 h-auto text-left"
              >
                <Users className="w-4 h-4 mr-2" />
                О компании
              </Button>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2" />
                г. Москва
              </div>
            </div>
          </div>

          {/* Режим работы */}
          <div className="space-y-4">
            <h3 className="font-semibold">Режим работы</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Пн-Пт</span>
                <span>9:00 - 21:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Сб-Вс</span>
                <span>10:00 - 20:00</span>
              </div>
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">Сейчас онлайн</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Юридическая информация */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <strong>ИП Иванов Иван Иванович</strong><br />
              ИНН: 123456789012<br />
              ОГРНИП: 123456789012345
            </div>
            <div>
              <strong>Юридический адрес:</strong><br />
              123456, г. Москва, ул. Примерная, д. 123, кв. 1
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button variant="ghost" size="sm" className="text-xs">
              Политика конфиденциальности
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Пользовательское соглашение
            </Button>
            <Button variant="ghost" size="sm" className="text-xs">
              Публичная оферта
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Копирайт */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© {currentYear} ТехноМаркет. Все права защищены.</p>
          <p className="mt-1">
            Информация на сайте не является публичной офертой
          </p>
        </div>
      </div>
    </footer>
  );
};