-- Добавляем поля для множественных изображений
ALTER TABLE public.products 
ADD COLUMN image2 TEXT,
ADD COLUMN image3 TEXT;

-- Создаем индексы для новых полей
CREATE INDEX products_image2_idx ON public.products(image2);
CREATE INDEX products_image3_idx ON public.products(image3);

-- Комментарии для понимания структуры
COMMENT ON COLUMN public.products.image IS 'Основное изображение товара';
COMMENT ON COLUMN public.products.image2 IS 'Дополнительное изображение товара №2';
COMMENT ON COLUMN public.products.image3 IS 'Дополнительное изображение товара №3';