import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X,
  CheckCircle2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  subcategories?: Category[];
}

interface FilterState {
  category: string | null;
  subcategory: string | null;
  sortBy: 'name' | 'price' | 'date';
  sortOrder: 'asc' | 'desc';
  priceRange: {
    min: number | null;
    max: number | null;
  };
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
  currentFilters: FilterState;
  onQuickSort?: (sortBy: 'price', sortOrder: 'asc' | 'desc') => void;
}

export const AdvancedFilters = ({ onFiltersChange, currentFilters, onQuickSort }: AdvancedFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);
  const [priceStats, setPriceStats] = useState({ min: 0, max: 100000 });

  useEffect(() => {
    fetchCategories();
    fetchPriceStats();
  }, []);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      // Организуем категории в иерархию
      const parentCategories = data.filter(cat => !cat.parent_id);
      const categoryTree = parentCategories.map(parent => ({
        ...parent,
        subcategories: data.filter(cat => cat.parent_id === parent.id)
      }));

      setCategories(categoryTree);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPriceStats = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('price');

      if (error) throw error;

      if (data && data.length > 0) {
        const prices = data.map(p => p.price);
        setPriceStats({
          min: Math.min(...prices),
          max: Math.max(...prices)
        });
      }
    } catch (error) {
      console.error('Error fetching price stats:', error);
    }
  };

  const getSelectedCategory = () => {
    if (!localFilters.category) return null;
    
    for (const category of categories) {
      if (category.id === localFilters.category) return category;
      if (category.subcategories) {
        const subcategory = category.subcategories.find(sub => sub.id === localFilters.category);
        if (subcategory) return subcategory;
      }
    }
    return null;
  };

  const getSelectedSubcategory = () => {
    if (!localFilters.subcategory) return null;
    
    for (const category of categories) {
      if (category.subcategories) {
        const subcategory = category.subcategories.find(sub => sub.id === localFilters.subcategory);
        if (subcategory) return subcategory;
      }
    }
    return null;
  };

  const handleCategoryChange = (categoryValue: string) => {
    const categoryName = categoryValue === 'all' ? null : 
                        categories.find(cat => cat.id === categoryValue)?.name || null;
    setLocalFilters(prev => ({
      ...prev,
      category: categoryName,
      subcategory: null // Сбрасываем подкатегорию при смене категории
    }));
  };

  const handleSubcategoryChange = (subcategoryValue: string) => {
    if (subcategoryValue === 'all') {
      setLocalFilters(prev => ({
        ...prev,
        subcategory: null
      }));
    } else {
      // Находим подкатегорию и её родительскую категорию
      let parentCategoryName = null;
      let subcategoryName = null;
      
      for (const category of categories) {
        const foundSubcategory = category.subcategories?.find(sub => sub.id === subcategoryValue);
        if (foundSubcategory) {
          parentCategoryName = category.name;
          subcategoryName = foundSubcategory.name;
          break;
        }
      }
      
      setLocalFilters(prev => ({
        ...prev,
        category: parentCategoryName,
        subcategory: subcategoryName
      }));
    }
  };

  const handleSortChange = (sortBy: 'name' | 'price' | 'date', sortOrder: 'asc' | 'desc') => {
    setLocalFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder
    }));
  };

  const handlePriceRangeChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseInt(value);
    setLocalFilters(prev => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [field]: numValue
      }
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      category: null,
      subcategory: null,
      sortBy: 'date',
      sortOrder: 'desc',
      priceRange: { min: null, max: null }
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const clearFilter = (filterType: 'category' | 'subcategory' | 'price') => {
    const newFilters = { ...localFilters };
    
    if (filterType === 'category') {
      newFilters.category = null;
      newFilters.subcategory = null;
    } else if (filterType === 'subcategory') {
      newFilters.subcategory = null;
    } else if (filterType === 'price') {
      newFilters.priceRange = { min: null, max: null };
    }
    
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const hasActiveFilters = currentFilters.category || 
                          currentFilters.subcategory || 
                          currentFilters.priceRange.min !== null || 
                          currentFilters.priceRange.max !== null ||
                          currentFilters.sortBy !== 'date' ||
                          currentFilters.sortOrder !== 'desc';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getSortLabel = () => {
    const sortLabels = {
      name: 'Название',
      price: 'Цена',
      date: 'Дата добавления'
    };
    
    const orderLabels = {
      asc: currentFilters.sortBy === 'price' ? 'по возрастанию' : 'А-Я',
      desc: currentFilters.sortBy === 'price' ? 'по убыванию' : 'Я-А'
    };

    return `${sortLabels[currentFilters.sortBy]} ${orderLabels[currentFilters.sortOrder]}`;
  };

  return (
    <div className="space-y-4">
      {/* Кнопка открытия фильтров */}
      <div className="flex items-center gap-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Фильтры
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">
                  {[
                    currentFilters.category && 1,
                    currentFilters.subcategory && 1,
                    (currentFilters.priceRange.min !== null || currentFilters.priceRange.max !== null) && 1
                  ].filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Настройка фильтров
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Категории */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Категории и подкатегории</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Выбор основной категории */}
                  <div>
                    <Label>Основная категория</Label>
                    <Select 
                      value={categories.find(cat => cat.name === localFilters.category)?.id || 'all'} 
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                                              <SelectContent>
                        <SelectItem value="all">Все категории</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Выбор подкатегории */}
                  <div>
                    <Label>Подкатегория</Label>
                    <Select 
                      value={categories.flatMap(cat => cat.subcategories || [])
                                      .find(sub => sub.name === localFilters.subcategory)?.id || 'all'} 
                      onValueChange={handleSubcategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите подкатегорию" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все подкатегории</SelectItem>
                        {localFilters.category ? (
                          // Показываем подкатегории выбранной категории
                          categories
                            .find(cat => cat.name === localFilters.category)
                            ?.subcategories?.map((subcategory) => (
                              <SelectItem key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                              </SelectItem>
                            ))
                        ) : (
                          // Показываем все подкатегории, если категория не выбрана
                          categories.flatMap(cat => cat.subcategories || []).map((subcategory) => (
                            <SelectItem key={subcategory.id} value={subcategory.id}>
                              {subcategory.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Ценовой диапазон */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ценовой диапазон</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>От (₽)</Label>
                      <input
                        type="number"
                        placeholder={priceStats.min.toString()}
                        value={localFilters.priceRange.min || ''}
                        onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <Label>До (₽)</Label>
                      <input
                        type="number"
                        placeholder={priceStats.max.toString()}
                        value={localFilters.priceRange.max || ''}
                        onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Диапазон цен: {formatPrice(priceStats.min)} - {formatPrice(priceStats.max)}
                  </p>
                </CardContent>
              </Card>

              {/* Сортировка */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Сортировка</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Сортировать по</Label>
                      <Select 
                        value={localFilters.sortBy} 
                        onValueChange={(value: 'name' | 'price' | 'date') => 
                          handleSortChange(value, localFilters.sortOrder)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Дате добавления</SelectItem>
                          <SelectItem value="name">Названию</SelectItem>
                          <SelectItem value="price">Цене</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Порядок</Label>
                      <Select 
                        value={localFilters.sortOrder} 
                        onValueChange={(value: 'asc' | 'desc') => 
                          handleSortChange(localFilters.sortBy, value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {localFilters.sortBy === 'price' ? (
                            <>
                              <SelectItem value="asc">По возрастанию</SelectItem>
                              <SelectItem value="desc">По убыванию</SelectItem>
                            </>
                          ) : localFilters.sortBy === 'name' ? (
                            <>
                              <SelectItem value="asc">А → Я</SelectItem>
                              <SelectItem value="desc">Я → А</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="desc">Новые сначала</SelectItem>
                              <SelectItem value="asc">Старые сначала</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Кнопки действий */}
              <div className="flex gap-3">
                <Button onClick={resetFilters} variant="outline" className="flex-1">
                  Сбросить все
                </Button>
                <Button onClick={applyFilters} className="flex-1">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Применить
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>


      </div>

      {/* Активные фильтры */}
      {hasActiveFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Активные фильтры:</span>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="w-4 h-4 mr-1" />
                Очистить все
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {currentFilters.category && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getSelectedCategory()?.name}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => clearFilter('category')}
                  />
                </Badge>
              )}
              
              {currentFilters.subcategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {getSelectedSubcategory()?.name}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => clearFilter('subcategory')}
                  />
                </Badge>
              )}
              
              {(currentFilters.priceRange.min !== null || currentFilters.priceRange.max !== null) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {currentFilters.priceRange.min ? formatPrice(currentFilters.priceRange.min) : '0'} - 
                  {currentFilters.priceRange.max ? formatPrice(currentFilters.priceRange.max) : '∞'}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => clearFilter('price')}
                  />
                </Badge>
              )}
              
              {(currentFilters.sortBy !== 'date' || currentFilters.sortOrder !== 'desc') && (
                <Badge variant="outline">
                  <ArrowUpDown className="w-3 h-3 mr-1" />
                  {getSortLabel()}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};