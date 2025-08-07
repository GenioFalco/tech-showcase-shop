import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

interface CategoryManagerProps {
  onCategoryChange?: () => void;
}

export const CategoryManager = ({ onCategoryChange }: CategoryManagerProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить категории",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .insert({
          name: newCategoryName.trim(),
          parent_id: selectedParentId || null
        });

      if (error) throw error;

      setNewCategoryName("");
      setSelectedParentId(null);
      await fetchCategories();
      onCategoryChange?.();
      
      toast({
        title: "Успех",
        description: "Категория добавлена",
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить категорию",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: editingCategory.name.trim(),
          parent_id: selectedParentId || null
        })
        .eq('id', editingCategory.id);

      if (error) throw error;

      setEditingCategory(null);
      setSelectedParentId(null);
      await fetchCategories();
      onCategoryChange?.();
      
      toast({
        title: "Успех",
        description: "Категория обновлена",
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить категорию",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Вы уверены, что хотите удалить эту категорию? Все подкатегории также будут удалены.")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      await fetchCategories();
      onCategoryChange?.();
      
      toast({
        title: "Успех",
        description: "Категория удалена",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить категорию",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMainCategories = () => categories.filter(cat => !cat.parent_id);
  const getSubCategories = (parentId: string) => categories.filter(cat => cat.parent_id === parentId);

  const renderCategoryTree = () => {
    return getMainCategories().map(mainCategory => (
      <Card key={mainCategory.id} className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="default">{mainCategory.name}</Badge>
              <span className="text-sm text-muted-foreground">
                ({getSubCategories(mainCategory.id).length} подкатегорий)
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingCategory(mainCategory);
                  setSelectedParentId(mainCategory.parent_id);
                }}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDeleteCategory(mainCategory.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {getSubCategories(mainCategory.id).length > 0 && (
            <div className="ml-4 space-y-2">
              {getSubCategories(mainCategory.id).map(subCategory => (
                <div key={subCategory.id} className="flex items-center justify-between">
                  <Badge variant="secondary">{subCategory.name}</Badge>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingCategory(subCategory);
                        setSelectedParentId(subCategory.parent_id);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteCategory(subCategory.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {editingCategory ? "Редактировать категорию" : "Добавить новую категорию"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="categoryName">Название категории</Label>
            <Input
              id="categoryName"
              value={editingCategory ? editingCategory.name : newCategoryName}
              onChange={(e) => {
                if (editingCategory) {
                  setEditingCategory({ ...editingCategory, name: e.target.value });
                } else {
                  setNewCategoryName(e.target.value);
                }
              }}
              placeholder="Введите название категории"
            />
          </div>

          <div>
            <Label htmlFor="parentCategory">Родительская категория (опционально)</Label>
            <Select
              value={selectedParentId || "none"}
              onValueChange={(value) => setSelectedParentId(value === "none" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите родительскую категорию" />
              </SelectTrigger>
              <SelectContent className="bg-background border z-50">
                <SelectItem value="none">Основная категория</SelectItem>
                {getMainCategories().map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            {editingCategory ? (
              <>
                <Button onClick={handleUpdateCategory} disabled={loading}>
                  Обновить категорию
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingCategory(null);
                    setSelectedParentId(null);
                  }}
                  disabled={loading}
                >
                  Отмена
                </Button>
              </>
            ) : (
              <Button onClick={handleAddCategory} disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить категорию
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Управление категориями</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-muted-foreground">Категории не найдены</p>
          ) : (
            renderCategoryTree()
          )}
        </CardContent>
      </Card>
    </div>
  );
};