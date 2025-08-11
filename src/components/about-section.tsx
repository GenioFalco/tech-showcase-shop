import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Award, Users, Zap } from "lucide-react";

export const AboutSection = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Проверенное качество",
      description: "Все товары проходят контроль качества перед отправкой"
    },
    {
      icon: Award,
      title: "Официальная гарантия",
      description: "Предоставляем гарантию на всю продукцию"
    },
    {
      icon: Users,
      title: "Более 10,000 клиентов",
      description: "Нам доверяют покупатели по всей России"
    },
    {
      icon: Zap,
      title: "Быстрая доставка",
      description: "Отправляем товары в день заказа"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              О компании
            </Badge>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              Почему выбирают тысяча мелочей?
            </h2>
            <p className="text-lg text-muted-foreground">
              Мы продаем качественную проверенную техниу и аксессуары по выгодным ценам. 
              Работаем по всей России уже более 5 лет.
            </p>
          </div>

          {/* Основной текст */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed mb-6">
                  <strong>тысяча мелочей</strong> — это современный интернет-магазин проверенной техники и аксессуаров, 
                  который предлагает широкий ассортимент качественных товаров по доступным ценам. 
                  Мы специализируемся на продаже смартфонов, наушников, зарядных устройств, 
                  бытовой техники и современных гаджетов.
                </p>
                <p className="text-foreground leading-relaxed mb-6">
                  Наша миссия — сделать современные технологии доступными каждому. 
                  Мы тщательно отбираем поставщиков и проверяем качество каждого товара, 
                  чтобы наши клиенты получали только лучшее.
                </p>
                <p className="text-foreground leading-relaxed">
                  Работаем с физическими и юридическими лицами, предоставляем гарантию на всю продукцию 
                  и обеспечиваем быструю доставку по всей России.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Преимущества */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-card transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Статистика */}
          <Card className="bg-gradient-hero text-white">
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold mb-2">5+</div>
                  <div className="text-blue-100">лет на рынке</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">10K+</div>
                  <div className="text-blue-100">довольных клиентов</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-2">99%</div>
                  <div className="text-blue-100">положительных отзывов</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};