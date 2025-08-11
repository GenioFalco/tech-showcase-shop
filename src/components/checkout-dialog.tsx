import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, CreditCard, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert, Json } from "@/integrations/supabase/types";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  onOrderSuccess: () => void;
}

export const CheckoutDialog = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  totalAmount, 
  onOrderSuccess 
}: CheckoutDialogProps) => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const generateOrderNumber = () => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = now.getTime().toString().slice(-4);
    return `ORD-${date}-${time}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, укажите ваше имя",
        variant: "destructive"
      });
      return;
    }

    if (!formData.customerPhone.trim()) {
      toast({
        title: "Ошибка", 
        description: "Пожалуйста, укажите номер телефона",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Генерируем номер заказа на клиенте
      const orderNumber = generateOrderNumber();

      // Подготавливаем данные заказа строго по типу таблицы
      const orderData: TablesInsert<'orders'> = {
        order_number: orderNumber,
        customer_name: formData.customerName.trim(),
        customer_phone: formData.customerPhone.trim(),
        customer_email: formData.customerEmail.trim() || null,
        items: (cartItems.map(({ id, name, price, quantity, image }) => ({
          id,
          name,
          price,
          quantity,
          image,
        })) as unknown) as Json,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'unpaid',
        notes: formData.notes.trim() || null,
      };

      // Создаем заказ
      const { error: insertError } = await supabase
        .from('orders')
        .insert(orderData);

      if (insertError) throw insertError;

      toast({
        title: "Заказ оформлен!",
        description: `Ваш заказ ${orderNumber} принят. Мы свяжемся с вами в ближайшее время.`
      });

      // Отправляем уведомление в WhatsApp
      const message = `🛒 Новый заказ ${orderNumber}\n\n` +
        `👤 Клиент: ${formData.customerName}\n` +
        `📞 Телефон: ${formData.customerPhone}\n` +
        `${formData.customerEmail ? `📧 Email: ${formData.customerEmail}\n` : ''}` +
        `\n📦 Товары:\n` +
        cartItems.map(item => `• ${item.name} - ${item.quantity} шт. × ${formatPrice(item.price)} = ${formatPrice(item.price * item.quantity)}`).join('\n') +
        `\n\n💰 Итого: ${formatPrice(totalAmount)}\n` +
        `${formData.notes ? `\n📝 Примечания: ${formData.notes}` : ''}`;

      const encodedMessage = encodeURIComponent(message);
      // Открываем WhatsApp (веб/мобильный) для уведомления админа
      const whatsappPhone = '79103561190';
      const waUrl = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;
      window.open(waUrl, '_blank');

      onOrderSuccess();
      onClose();
      
      // Очищаем форму
      setFormData({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        notes: ''
      });

    } catch (error) {
      console.error('Error creating order:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      let errorMessage = "Не удалось оформить заказ. Попробуйте еще раз.";
      
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = `Ошибка: ${error.message}`;
      }
      
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Оформление заказа
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Контактная информация */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Контактная информация
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Имя *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    placeholder="Ваше имя"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Телефон *</Label>
                  <Input
                    id="customerPhone"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="customerEmail">Email (необязательно)</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes">Примечания к заказу</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Дополнительные пожелания или комментарии..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Товары в заказе */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Ваш заказ
              </h3>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-2">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.quantity} × {formatPrice(item.price)}
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Итого:</span>
                  <span className="text-primary">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Кнопки */}
          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button 
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Оформляется...' : 'Оформить заказ'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            После оформления заказа мы свяжемся с вами для подтверждения и уточнения деталей доставки
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};