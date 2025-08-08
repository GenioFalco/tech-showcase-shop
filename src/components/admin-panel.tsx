import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Plus, Save, X, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUpload } from "@/components/image-upload";
import { CategoryManager } from "@/components/category-manager";
import { CategorySelector } from "@/components/category-selector";
import { OrdersManager } from "@/components/orders-manager";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  image2?: string;
  image3?: string;
  category: string;
  subcategory?: string;
  in_stock: boolean;
}

interface AdminPanelProps {
  onProductsUpdate: (products: Product[]) => void;
  onLogout: () => void;
}

export const AdminPanel = ({ onProductsUpdate, onLogout }: AdminPanelProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedProducts = data.map(product => {
        // Нормализуем категорию и подкатегорию, если категория сохранена как "Parent > Sub"
        let normalizedCategory = product.category as string | null;
        let normalizedSubcategory = product.subcategory as string | null;
        if ((!normalizedSubcategory || normalizedSubcategory === '') 
            && typeof normalizedCategory === 'string' 
            && normalizedCategory.includes(' > ')) {
          const parts = normalizedCategory.split('>');
          const parent = (parts[0] || '').trim();
          const sub = (parts[1] || '').trim();
          normalizedCategory = parent || normalizedCategory;
          normalizedSubcategory = sub || null;
        }

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          image2: product.image2,
          image3: product.image3,
          category: normalizedCategory || product.category,
          subcategory: normalizedSubcategory || product.subcategory,
          in_stock: product.in_stock,
        };
      });
      
      setProducts(formattedProducts);
      onProductsUpdate(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить товары",
        variant: "destructive"
      });
    }
  };


  const handleAdd = () => {
    setIsAdding(true);
    setEditForm({
      name: '',
      description: '',
      price: 0,
      image: '/api/placeholder/300/300',
      category: 'Электроника',
      in_stock: true
    });
  };

  const handleEdit = (product: Product) => {
    setIsEditing(product.id);
    setEditForm(product);
  };

  const handleSave = async () => {
    try {
      if (isAdding) {
        // Временно убираем image2 и image3 до обновления БД
        const productData: any = {
          name: editForm.name || '',
          description: editForm.description || '',
          price: editForm.price || 0,
          image: editForm.image || '/api/placeholder/300/300',
          category: editForm.category || 'Электроника',
          in_stock: editForm.in_stock ?? true
        };
        
        // Добавляем subcategory только если поле существует в БД
        if (editForm.subcategory) {
          productData.subcategory = editForm.subcategory;
        }
        
        // Пробуем добавить image2 и image3, если поля есть в БД
        try {
          if (editForm.image2) productData.image2 = editForm.image2;
          if (editForm.image3) productData.image3 = editForm.image3;
        } catch (e) {
          console.log('Дополнительные изображения пока не поддерживаются');
        }

        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
        
        toast({
          title: "Товар добавлен",
          description: "Новый товар успешно добавлен в каталог"
        });
      } else if (isEditing) {
        // Временно убираем image2 и image3 до обновления БД
        const updateData: any = {
          name: editForm.name,
          description: editForm.description,
          price: editForm.price,
          image: editForm.image,
          category: editForm.category,
          in_stock: editForm.in_stock
        };
        
        // Добавляем subcategory только если поле существует в БД
        if (editForm.subcategory !== undefined) {
          updateData.subcategory = editForm.subcategory;
        }
        
        // Пробуем добавить image2 и image3, если поля есть в БД
        try {
          if (editForm.image2 !== undefined) updateData.image2 = editForm.image2;
          if (editForm.image3 !== undefined) updateData.image3 = editForm.image3;
        } catch (e) {
          console.log('Дополнительные изображения пока не поддерживаются');
        }

        const { error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', isEditing);
        
        if (error) throw error;
        
        toast({
          title: "Товар обновлен",
          description: "Изменения сохранены"
        });
      }
      
      await fetchProducts();
      setIsAdding(false);
      setIsEditing(null);
      setEditForm({});
    } catch (error) {
      console.error('Error saving product:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      let errorMessage = "Не удалось сохранить товар";
      
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = `Ошибка: ${error.message}`;
        
        // Если ошибка связана с отсутствующими полями
        if (error.message.includes('column') && (error.message.includes('image2') || error.message.includes('image3'))) {
          errorMessage = "База данных не обновлена. Нужно добавить поля image2 и image3.";
        }
      }
      
      toast({
        title: "Ошибка",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchProducts();
      toast({
        title: "Товар удален",
        description: "Товар удален из каталога"
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить товар",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(null);
    setEditForm({});
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Админ-панель x-brand</h1>
          <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Выйти
          </Button>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList>
            <TabsTrigger value="products">Товары</TabsTrigger>
            <TabsTrigger value="categories">Категории</TabsTrigger>
            <TabsTrigger value="orders">Заказы</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Управление товарами</h2>
              <Button onClick={handleAdd} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Добавить товар
              </Button>
            </div>

            {(isAdding || isEditing) && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {isAdding ? 'Добавить новый товар' : 'Редактировать товар'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Название</Label>
                      <Input
                        id="name"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Цена (руб.)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={editForm.price || ''}
                        onChange={(e) => setEditForm({...editForm, price: Number(e.target.value)})}
                      />
                    </div>
                    <div>
                      {(() => {
                        const currentPath = editForm.subcategory 
                          ? `${editForm.category || ''} > ${editForm.subcategory}`
                          : (editForm.category || '');
                        return (
                          <CategorySelector
                            value={currentPath}
                            onChange={(path) => {
                              if (!path) {
                                setEditForm({ ...editForm, category: undefined, subcategory: undefined });
                                return;
                              }
                              if (path.includes(' > ')) {
                                const [parent, sub] = path.split(' > ').map(p => p.trim());
                                setEditForm({ ...editForm, category: parent, subcategory: sub });
                              } else {
                                setEditForm({ ...editForm, category: path, subcategory: undefined });
                              }
                            }}
                          />
                        );
                      })()}
                    </div>
                    <div className="md:col-span-2">
                      <div className="space-y-4">
                        <div>
                          <Label>Основное изображение</Label>
                          <ImageUpload
                            onImageUploaded={(url) => setEditForm({...editForm, image: url})}
                            currentImage={editForm.image}
                          />
                        </div>
                        <div>
                          <Label>Дополнительное изображение 2</Label>
                          <ImageUpload
                            onImageUploaded={(url) => setEditForm({...editForm, image2: url})}
                            currentImage={editForm.image2}
                          />
                        </div>
                        <div>
                          <Label>Дополнительное изображение 3</Label>
                          <ImageUpload
                            onImageUploaded={(url) => setEditForm({...editForm, image3: url})}
                            currentImage={editForm.image3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      value={editForm.description || ''}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="inStock"
                      checked={editForm.in_stock}
                      onChange={(e) => setEditForm({...editForm, in_stock: e.target.checked})}
                    />
                    <Label htmlFor="inStock">В наличии</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {products.map(product => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="font-bold">{product.price} ₽</span>
                          <span className="text-sm bg-secondary px-2 py-1 rounded">
                            {product.category}
                          </span>
                          <span className={`text-sm px-2 py-1 rounded ${
                            product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.in_stock ? 'В наличии' : 'Нет в наличии'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Товаров пока нет. Нажмите "Добавить товар" чтобы начать.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-6">
            <h2 className="text-xl font-semibold">Управление категориями</h2>
            <CategoryManager onCategoryChange={fetchProducts} />
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-6">
            <OrdersManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};