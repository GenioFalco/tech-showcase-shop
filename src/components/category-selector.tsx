import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
}

interface CategorySelectorProps {
  value?: string;
  onChange: (categoryPath: string) => void;
  label?: string;
}

export const CategorySelector = ({ value, onChange, label = "Категория" }: CategorySelectorProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getMainCategories = () => categories.filter(cat => !cat.parent_id);
  const getSubCategories = (parentId: string) => categories.filter(cat => cat.parent_id === parentId);

  const buildCategoryPath = (category: Category): string => {
    if (!category.parent_id) {
      return category.name;
    }
    
    const parentCategory = categories.find(cat => cat.id === category.parent_id);
    if (parentCategory) {
      return `${parentCategory.name} > ${category.name}`;
    }
    
    return category.name;
  };

  const getAllCategoriesFlat = () => {
    const flatCategories: { id: string; path: string; category: Category }[] = [];
    
    // Добавляем основные категории
    getMainCategories().forEach(mainCat => {
      flatCategories.push({
        id: mainCat.id,
        path: mainCat.name,
        category: mainCat
      });
      
      // Добавляем подкатегории
      getSubCategories(mainCat.id).forEach(subCat => {
        flatCategories.push({
          id: subCat.id,
          path: buildCategoryPath(subCat),
          category: subCat
        });
      });
    });
    
    return flatCategories;
  };

  if (loading) {
    return (
      <div>
        <Label>{label}</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Загрузка..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Выберите категорию" />
        </SelectTrigger>
        <SelectContent className="bg-background border z-50 max-h-60 overflow-y-auto">
          {getAllCategoriesFlat().map(({ id, path }) => (
            <SelectItem key={id} value={path}>
              {path}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};