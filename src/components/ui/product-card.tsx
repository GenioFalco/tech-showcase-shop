import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MessageCircle, Eye } from "lucide-react";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart, onBuyNow, onViewDetails }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden bg-gradient-card border-border/50 hover:shadow-hover transition-all duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.inStock && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 right-2 bg-success text-success-foreground"
          >
            В наличии
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold bg-gradient-price bg-clip-text text-transparent">
            {formatPrice(product.price)}
          </div>
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
        </div>
        
        <div className="space-y-2 pt-2">
          {/* Кнопка подробнее */}
          {onViewDetails && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewDetails(product)}
              className="w-full hover:bg-muted transition-all duration-200"
            >
              <Eye className="w-4 h-4 mr-1" />
              Подробнее
            </Button>
          )}
          
          {/* Основные кнопки */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAddToCart(product)}
              className="flex-1 hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              В корзину
            </Button>
            <Button 
              size="sm" 
              onClick={() => onBuyNow(product)}
              className="flex-1 bg-primary hover:bg-primary-dark shadow-button transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Купить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};