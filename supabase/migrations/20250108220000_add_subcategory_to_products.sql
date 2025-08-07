-- Добавляем поле subcategory к таблице products
ALTER TABLE public.products ADD COLUMN subcategory VARCHAR(255);

-- Создаем индекс для быстрого поиска по подкатегориям
CREATE INDEX products_subcategory_idx ON public.products(subcategory);

-- Добавляем несколько базовых иерархических категорий
INSERT INTO public.categories (name, parent_id) VALUES 
  ('Электроника', NULL),
  ('Аксессуары', NULL),
  ('Дом и быт', NULL),
  ('Спорт и отдых', NULL)
ON CONFLICT (name) DO NOTHING;

-- Получаем ID категории "Электроника"
DO $$
DECLARE
  electronics_id UUID;
  accessories_id UUID;
  home_id UUID;
  sport_id UUID;
BEGIN
  -- Получаем ID основных категорий
  SELECT id INTO electronics_id FROM public.categories WHERE name = 'Электроника' AND parent_id IS NULL;
  SELECT id INTO accessories_id FROM public.categories WHERE name = 'Аксессуары' AND parent_id IS NULL;
  SELECT id INTO home_id FROM public.categories WHERE name = 'Дом и быт' AND parent_id IS NULL;
  SELECT id INTO sport_id FROM public.categories WHERE name = 'Спорт и отдых' AND parent_id IS NULL;

  -- Добавляем подкатегории для Электроники
  INSERT INTO public.categories (name, parent_id) VALUES 
    ('Зарядные устройства', electronics_id),
    ('Аудио устройства', electronics_id),
    ('Смартфоны и планшеты', electronics_id),
    ('Компьютеры и ноутбуки', electronics_id),
    ('Умная электроника', electronics_id)
  ON CONFLICT (name) DO NOTHING;

  -- Добавляем подкатегории для Аксессуаров
  INSERT INTO public.categories (name, parent_id) VALUES 
    ('Чехлы и защита', accessories_id),
    ('Держатели и подставки', accessories_id),
    ('Кабели и адаптеры', accessories_id),
    ('Сумки и рюкзаки', accessories_id)
  ON CONFLICT (name) DO NOTHING;

  -- Добавляем подкатегории для Дома и быта
  INSERT INTO public.categories (name, parent_id) VALUES 
    ('Уход за домом', home_id),
    ('Кухонная техника', home_id),
    ('Освещение', home_id),
    ('Климат-техника', home_id)
  ON CONFLICT (name) DO NOTHING;

  -- Добавляем подкатегории для Спорта и отдыха
  INSERT INTO public.categories (name, parent_id) VALUES 
    ('Фитнес трекеры', sport_id),
    ('Спортивные аксессуары', sport_id),
    ('Туризм и отдых', sport_id)
  ON CONFLICT (name) DO NOTHING;
END $$;

-- Обновляем существующие товары с правильными категориями и подкатегориями
UPDATE public.products 
SET 
  category = 'Электроника',
  subcategory = 'Зарядные устройства'
WHERE (name ILIKE '%зарядка%' OR name ILIKE '%повербанк%' OR name ILIKE '%зарядное%');

UPDATE public.products 
SET 
  category = 'Электроника',
  subcategory = 'Аудио устройства'
WHERE (name ILIKE '%airpods%' OR name ILIKE '%наушники%' OR name ILIKE '%колонка%');

UPDATE public.products 
SET 
  category = 'Электроника',
  subcategory = 'Умная электроника'
WHERE (name ILIKE '%смарт%' OR name ILIKE '%фитнес%');

UPDATE public.products 
SET 
  category = 'Аксессуары',
  subcategory = 'Держатели и подставки'
WHERE name ILIKE '%держатель%';

UPDATE public.products 
SET 
  category = 'Аксессуары',
  subcategory = 'Чехлы и защита'
WHERE name ILIKE '%чехол%';