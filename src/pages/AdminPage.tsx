import { useState, useEffect } from "react";
import { AdminPanel } from "@/components/admin-panel";
import { AdminLogin } from "@/components/admin-login";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  in_stock: boolean;
}

const AdminPage = () => {
  const [, setProducts] = useState<Product[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Проверяем, залогинен ли админ
    const loggedIn = localStorage.getItem("adminLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleProductsUpdate = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminPanel onProductsUpdate={handleProductsUpdate} onLogout={handleLogout} />;
};

export default AdminPage;