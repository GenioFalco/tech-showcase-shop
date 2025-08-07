-- Создание таблицы заказов
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_email VARCHAR(255),
  items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  payment_status VARCHAR(50) NOT NULL DEFAULT 'unpaid',
  payment_method VARCHAR(50),
  payment_transaction_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Индексы для быстрого поиска
CREATE INDEX orders_order_number_idx ON public.orders(order_number);
CREATE INDEX orders_status_idx ON public.orders(status);
CREATE INDEX orders_payment_status_idx ON public.orders(payment_status);
CREATE INDEX orders_created_at_idx ON public.orders(created_at DESC);

-- Включаем RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Создаем политики безопасности (пока открытые для демо)
CREATE POLICY "Anyone can view orders" 
ON public.orders FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert orders" 
ON public.orders FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update orders" 
ON public.orders FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete orders" 
ON public.orders FOR DELETE 
USING (true);

-- Триггер для обновления updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Индекс для номеров заказов для быстрого поиска дубликатов
CREATE UNIQUE INDEX orders_order_number_unique_idx ON public.orders(order_number);