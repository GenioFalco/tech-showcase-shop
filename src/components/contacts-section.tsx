import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Instagram, 
  MapPin, 
  Clock,
  Send
} from "lucide-react";

export const ContactsSection = () => {

  const handleWhatsAppContact = () => {
    window.open('https://wa.me/79103561190', '_blank');
  };


  const handleEmailContact = () => {
    window.open('mailto:info@technomarket.ru', '_blank');
  };

  const handlePhoneContact = () => {
    window.open('tel:+79103561190', '_blank');
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Контакты
            </Badge>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              Свяжитесь с нами
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Готовы ответить на все ваши вопросы и помочь с выбором товаров
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Контактная информация */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-primary" />
                    Мессенджеры
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-3">
      
                    <Button 
                      variant="outline" 
                      onClick={handleWhatsAppContact}
                      className="justify-start h-auto p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">WhatsApp</div>
                          <div className="text-sm text-muted-foreground">+7 (910) 356-11-90</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Традиционные способы связи
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    onClick={handlePhoneContact}
                    className="justify-start w-full"
                  >
                    <Phone className="w-4 h-4 mr-3" />
                    +7 (910) 356-11-90
                  </Button>

                  <Button 
                    variant="outline" 
                    onClick={handleEmailContact}
                    className="justify-start w-full"
                  >
                    <Mail className="w-4 h-4 mr-3" />
                    info@technomarket.ru
                  </Button>

                
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Режим работы
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Понедельник - Пятница</span>
                      <span className="font-medium">9:00 - 21:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Суббота - Воскресенье</span>
                      <span className="font-medium">10:00 - 20:00</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm text-success">Сейчас онлайн</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Форма обратной связи */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Написать нам
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Имя</Label>
                      <Input id="name" placeholder="Ваше имя" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Телефон</Label>
                      <Input id="phone" placeholder="+7 (999) 999-99-99" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="example@email.com" />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Сообщение</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Опишите ваш вопрос или пожелание..."
                      rows={4}
                    />
                  </div>
                  
                  <Button className="w-full" size="lg">
                    <Send className="w-4 h-4 mr-2" />
                    Отправить сообщение
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Дополнительная информация */}
          <Card className="mt-8 bg-muted/50 flex justify-center">
            <CardContent className="p-6 w-full flex justify-center">
              <div className="w-full flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center justify-center items-center">
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="w-8 h-8 text-primary" />
                    <h3 className="font-semibold">Быстрый ответ</h3>
                    <p className="text-sm text-muted-foreground">
                      Отвечаем в течение 15 минут
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <MessageCircle className="w-8 h-8 text-primary" />
                    <h3 className="font-semibold">Консультации</h3>
                    <p className="text-sm text-muted-foreground">
                      Бесплатная помощь в выборе
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};