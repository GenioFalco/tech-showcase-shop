-- Create products table for storing shop items
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT NOT NULL,
  category TEXT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (shop visitors can see products)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- For now, allow everyone to manage products (you can restrict this later)
CREATE POLICY "Everyone can manage products" 
ON public.products 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, price, image, category, in_stock) VALUES
('Беспроводная зарядка 15W', 'Быстрая беспроводная зарядка с поддержкой Qi. Совместима с iPhone и Android.', 1890, '/src/assets/wireless-charger.jpg', 'Зарядные устройства', true),
('USB-C зарядка 65W', 'Мощное зарядное устройство для ноутбуков и смартфонов. GaN технология.', 2990, '/src/assets/usb-c-charger.jpg', 'Зарядные устройства', true),
('Повербанк 20000 мАч', 'Компактный внешний аккумулятор с быстрой зарядкой и дисплеем заряда.', 2490, '/src/assets/power-bank.jpg', 'Зарядные устройства', true),
('Чехол для iPhone 15 Pro', 'Прозрачный силиконовый чехол с усиленной защитой углов.', 890, '/src/assets/phone-case.jpg', 'Аксессуары', true),
('Автодержатель магнитный', 'Универсальный магнитный держатель для телефона в автомобиль.', 790, '/src/assets/car-holder.jpg', 'Аксессуары', true),
('AirPods Pro аналог', 'Беспроводные наушники с активным шумоподавлением и быстрым сопряжением.', 3490, '/src/assets/airpods-pro.jpg', 'Наушники', true);