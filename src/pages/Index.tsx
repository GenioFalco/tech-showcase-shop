import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, MessageCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { CatalogSection } from "@/components/catalog-section";
import { AboutSection } from "@/components/about-section";
import { ContactsSection } from "@/components/contacts-section";
import { Footer } from "@/components/footer";
import { CartItemComponent, CartItem } from "@/components/ui/cart-item";
import { CheckoutDialog } from "@/components/checkout-dialog";

import { Product } from "@/data/products";

const Index = () => {
  const [currentSection, setCurrentSection] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { toast } = useToast();

  // Функции для работы с корзиной
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    toast({
      title: "Товар добавлен в корзину",
      description: product.name,
    });
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Товар удален из корзины",
      variant: "destructive",
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Корзина очищена",
    });
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Функция покупки через мессенджеры
  const handleBuyNow = (product: Product) => {
    const message = `Здравствуйте, хочу купить: ${product.name}. Подскажите реквизиты для оплаты.`;
    const encodedMessage = encodeURIComponent(message);
    
    // Открываем WhatsApp
    window.open(`https://wa.me/79103561190?text=${encodedMessage}`, '_blank');
  };

  // Функция оформления заказа из корзины
  const handleCartOrder = () => {
    if (cartItems.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Функция успешного оформления заказа
  const handleOrderSuccess = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  // Компонент корзины
  const CartSheet = (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="w-4 h-4" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Корзина
            {cartItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4" />
                Очистить
              </Button>
            )}
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6">
          {cartItems.length === 0 ? (
            <Card className="p-8 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Корзина пуста</h3>
              <p className="text-muted-foreground mb-4">
                Добавьте товары из каталога
              </p>
              <Button onClick={() => setCurrentSection('catalog')}>
                Перейти в каталог
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Товары в корзине */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {cartItems.map((item) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateCartQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
              
              <Separator />
              
              {/* Итого */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Товаров: {getTotalItems()} шт.</span>
                      <span className="font-medium">{formatPrice(getTotalPrice())}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Итого:</span>
                      <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Кнопка заказа */}
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCartOrder}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Оформить заказ
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Нажимая кнопку, вы перейдете к оформлению заказа
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  // Рендер секций
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'home':
        return (
          <>
            <HeroSection onShopNow={() => setCurrentSection('catalog')} />
            <CatalogSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onAddToCart={addToCart}
              onBuyNow={handleBuyNow}
            />
          </>
        );
      case 'catalog':
        return (
          <CatalogSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onAddToCart={addToCart}
            onBuyNow={handleBuyNow}
          />
        );
      case 'about':
        return <AboutSection />;
      case 'contacts':
        return <ContactsSection />;
      default:
        return (
          <HeroSection onShopNow={() => setCurrentSection('catalog')} />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        cartItemsCount={getTotalItems()}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSectionChange={setCurrentSection}
        currentSection={currentSection}
        cartSheet={CartSheet}
      />
      
      <main>
        {renderCurrentSection()}
      </main>
      
      <Footer />

      {/* Диалог оформления заказа */}
      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        totalAmount={getTotalPrice()}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
};

export default Index;
