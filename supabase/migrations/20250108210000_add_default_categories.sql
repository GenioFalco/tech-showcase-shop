-- Добавляем базовые категории товаров
INSERT INTO public.categories (name) VALUES 
  ('Электроника'),
  ('Аксессуары'),
  ('Зарядные устройства'),
  ('Аудио'),
  ('Смартфоны'),
  ('Планшеты'),
  ('Ноутбуки'),
  ('Игровые консоли'),
  ('Умная электроника'),
  ('Кабели и адаптеры')
ON CONFLICT (name) DO NOTHING;

-- Обновляем существующие товары чтобы они имели правильные категории
UPDATE public.products 
SET category = 'Зарядные устройства' 
WHERE category = 'Электроника' 
AND (name ILIKE '%зарядка%' OR name ILIKE '%повербанк%' OR name ILIKE '%зарядное%');

UPDATE public.products 
SET category = 'Аудио' 
WHERE name ILIKE '%airpods%' OR name ILIKE '%наушники%' OR name ILIKE '%колонка%';

UPDATE public.products 
SET category = 'Умная электроника' 
WHERE name ILIKE '%смарт%' OR name ILIKE '%фитнес%';

UPDATE public.products 
SET category = 'Аксессуары' 
WHERE name ILIKE '%держатель%' OR name ILIKE '%чехол%';