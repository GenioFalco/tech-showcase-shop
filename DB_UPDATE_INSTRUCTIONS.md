# Инструкция по обновлению базы данных

Для поддержки множественных изображений товаров нужно выполнить следующие SQL команды в админке Supabase:

## 1. Откройте SQL Editor в Supabase Dashboard

## 2. Выполните следующий SQL запрос:

```sql
-- Добавляем поля для множественных изображений
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS image2 TEXT,
ADD COLUMN IF NOT EXISTS image3 TEXT;

-- Создаем индексы для новых полей
CREATE INDEX IF NOT EXISTS products_image2_idx ON public.products(image2);
CREATE INDEX IF NOT EXISTS products_image3_idx ON public.products(image3);

-- Комментарии для понимания структуры
COMMENT ON COLUMN public.products.image IS 'Основное изображение товара';
COMMENT ON COLUMN public.products.image2 IS 'Дополнительное изображение товара №2';
COMMENT ON COLUMN public.products.image3 IS 'Дополнительное изображение товара №3';
```

## 3. После выполнения SQL

После успешного выполнения SQL запроса:
- Обновите страницу админки
- Попробуйте добавить товар с несколькими изображениями
- Поля image2 и image3 станут доступными

## Альтернативный способ через CLI

Если у вас настроен Supabase CLI:

```bash
# Подключитесь к проекту
npx supabase link --project-ref YOUR_PROJECT_REF

# Примените миграции
npx supabase db push
```

## Проверка

После обновления база данных будет поддерживать:
- ✅ Основное изображение (image) - обязательное
- ✅ Дополнительное изображение 2 (image2) - опциональное  
- ✅ Дополнительное изображение 3 (image3) - опциональное