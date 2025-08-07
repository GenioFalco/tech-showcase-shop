import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart, 
  MessageCircle, 
  Truck, 
  Shield, 
  RefreshCw,
  Heart,
  Share2,
  ZoomIn
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  image2?: string;
  image3?: string;
  category: string;
  subcategory?: string;
  inStock: boolean;
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductDetailModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow
}: ProductDetailModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const { toast } = useToast();

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    if (quantity > 1) {
      toast({
        title: "Товары добавлены в корзину",
        description: `${product.name} (${quantity} шт.)`
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback - копируем в буфер обмена
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Ссылка скопирована",
        description: "Ссылка на товар скопирована в буфер обмена"
      });
    }
  };

  // Формируем массив изображений товара
  const productImages = [
    product.image,
    ...(product.image2 ? [product.image2] : []),
    ...(product.image3 ? [product.image3] : [])
  ].filter(Boolean);
  
  // Имитируем характеристики товара
  const getProductFeatures = (product: Product) => {
    const baseFeatures = [
      { label: "Гарантия", value: "12 месяцев" },
      { label: "Доставка", value: "1-3 дня" },
      { label: "Возврат", value: "14 дней" }
    ];

    // Добавляем специфичные характеристики в зависимости от категории
    if (product.category === "Электроника" || product.category === "Зарядные устройства") {
      return [
        ...baseFeatures,
        { label: "Тип подключения", value: "USB-C / Lightning" },
        { label: "Мощность", value: "15-65W" },
        { label: "Совместимость", value: "iPhone, Android" }
      ];
    }

    if (product.category === "Аудио") {
      return [
        ...baseFeatures,
        { label: "Подключение", value: "Bluetooth 5.0" },
        { label: "Время работы", value: "6-8 часов" },
        { label: "Дальность", value: "10 метров" }
      ];
    }

    return baseFeatures;
  };

  const features = getProductFeatures(product);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Изображения товара */}
          <div className="space-y-4">
            {/* Основное изображение */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      isImageZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                    onClick={() => setIsImageZoomed(!isImageZoomed)}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-4 right-4"
                    onClick={() => setIsImageZoomed(!isImageZoomed)}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-lg py-2 px-4">
                        Нет в наличии
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Миниатюры изображений */}
            <div className="flex gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-border'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Информация о товаре */}
          <div className="space-y-6">
            {/* Заголовок и цена */}
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold leading-tight">{product.name}</h1>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </div>
                <Badge variant="secondary">{product.category}</Badge>
              </div>


            </div>

            <Separator />

            {/* Описание */}
            <div className="space-y-3">
              <h3 className="font-semibold">Описание товара</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              
              {/* Дополнительное описание */}
              <div className="space-y-2 text-sm">
                <p>
                  Этот товар отличается высоким качеством и надежностью. 
                  Подходит для ежедневного использования и станет отличным 
                  дополнением к вашим устройствам.
                </p>
                <p>
                  Мы гарантируем оригинальность товара и предоставляем 
                  полную гарантию от производителя.
                </p>
              </div>
            </div>

            <Separator />

            {/* Характеристики */}
            <div className="space-y-3">
              <h3 className="font-semibold">Характеристики</h3>
              <div className="grid grid-cols-1 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex justify-between py-1">
                    <span className="text-muted-foreground">{feature.label}:</span>
                    <span className="font-medium">{feature.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Преимущества */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="w-5 h-5 text-green-600" />
                <span>Быстрая доставка по всей России</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Официальная гарантия производителя</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw className="w-5 h-5 text-purple-600" />
                <span>Возврат товара в течение 14 дней</span>
              </div>
            </div>

            <Separator />

            {/* Количество и кнопки */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Количество:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  В корзину
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onBuyNow(product)}
                  disabled={!product.inStock}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Купить сейчас
                </Button>
              </div>

              {!product.inStock && (
                <p className="text-sm text-muted-foreground text-center">
                  Товар временно отсутствует. Уведомим о поступлении!
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};