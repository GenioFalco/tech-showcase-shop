import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/ui/product-card";
import { ProductDetailModal } from "@/components/product-detail-modal";
import { AdvancedFilters } from "@/components/advanced-filters";
import { Search, Filter } from "lucide-react";
// import { categories } from "@/data/products"; // Больше не используем статичные категории
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  subcategory?: string;
  inStock: boolean;
}

interface CatalogSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddToCart: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const CatalogSection = ({ 
  searchQuery, 
  onSearchChange, 
  onAddToCart, 
  onBuyNow 
}: CatalogSectionProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: null as string | null,
    subcategory: null as string | null,
    sortBy: 'date' as 'name' | 'price' | 'date',
    sortOrder: 'desc' as 'asc' | 'desc',
    priceRange: { min: null as number | null, max: null as number | null }
  });

  useEffect(() => {
    fetchProducts();
  }, []);



  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedProducts = data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        image2: product.image2,
        image3: product.image3,
        category: product.category,
        subcategory: product.subcategory,
        inStock: product.in_stock
      }));
      
      setProducts(formattedProducts);
      console.log('Товары загружены:', formattedProducts.length);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };



  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Логика фильтрации по категориям и подкатегориям
    if (filters.subcategory) {
      // Если выбрана подкатегория - показываем только товары этой подкатегории
      filtered = filtered.filter(product => product.subcategory === filters.subcategory);
    } else if (filters.category) {
      // Если выбрана только категория - показываем все товары этой категории (включая все подкатегории)
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Фильтр по цене
    if (filters.priceRange.min !== null) {
      filtered = filtered.filter(product => product.price >= filters.priceRange.min!);
    }
    if (filters.priceRange.max !== null) {
      filtered = filtered.filter(product => product.price <= filters.priceRange.max!);
    }

    // Поиск по названию и описанию
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Сортировка
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'ru');
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'date':
        default:
          // Для даты используем ID как приблизительный показатель времени создания
          comparison = a.id.localeCompare(b.id);
          break;
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [products, filters, searchQuery]);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
            Каталог товаров
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Широкий ассортимент качественной электроники и аксессуаров по доступным ценам
          </p>
        </div>

        {/* Поиск и фильтры */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start">
              {/* Поиск */}
              <div className="relative flex-1 w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Поиск по названию или описанию..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Продвинутые фильтры */}
              <div className="w-full lg:w-auto">
                <AdvancedFilters
                  currentFilters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
            </div>

            {/* Результаты поиска и фильтрации */}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Показано товаров: <span className="font-medium">{filteredProducts.length}</span>
                {products.length > 0 && (
                  <span> из <span className="font-medium">{products.length}</span></span>
                )}
                {searchQuery && (
                  <span> по запросу "<span className="font-medium">{searchQuery}</span>"</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Товары */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onBuyNow={onBuyNow}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Товары не найдены</h3>
              <p className="text-muted-foreground mb-4">
                Попробуйте изменить критерии поиска или выбрать другую категорию
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFilters({
                    category: null,
                    subcategory: null,
                    sortBy: 'date',
                    sortOrder: 'desc',
                    priceRange: { min: null, max: null }
                  });
                  onSearchChange("");
                }}
              >
                Сбросить фильтры
              </Button>
            </div>
          </Card>
        )}

        {/* Статистика */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">{products.length}+</div>
            <div className="text-sm text-muted-foreground">Товаров в наличии</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">8+</div>
            <div className="text-sm text-muted-foreground">Категорий</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">Поддержка</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-2xl font-bold text-primary">99%</div>
            <div className="text-sm text-muted-foreground">Довольных клиентов</div>
          </Card>
        </div>
      </div>

      {/* Модальное окно с деталями товара */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
      />
    </section>
  );
};