import wirelessCharger from '@/assets/wireless-charger.jpg';
import usbcCharger from '@/assets/usb-c-charger.jpg';
import powerBank from '@/assets/power-bank.jpg';
import phoneCase from '@/assets/phone-case.jpg';
import carHolder from '@/assets/car-holder.jpg';
import airpodsPro from '@/assets/airpods-pro.jpg';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  image2?: string;
  image3?: string;
  category: string;
  subcategory?: string;
  inStock: boolean;
}

export const categories = [
  "Все товары",
  "Электроника", 
  "Дом и быт",
  "Спорт и отдых",
  "Красота и здоровье",
  "Одежда и обувь",
  "Авто и мото",
  "Книги и хобби"
];

export const products: Product[] = [
  // Электроника
  {
    id: "1",
    name: "Беспроводная зарядка 15W",
    description: "Быстрая беспроводная зарядка с поддержкой Qi. Совместима с iPhone и Android.",
    price: 1890,
    image: wirelessCharger,
    category: "Электроника",
    inStock: true
  },
  {
    id: "2", 
    name: "USB-C зарядка 65W",
    description: "Мощное зарядное устройство для ноутбуков и смартфонов. GaN технология.",
    price: 2990,
    image: usbcCharger,
    category: "Электроника",
    inStock: true
  },
  {
    id: "3",
    name: "Повербанк 20000 мАч",
    description: "Компактный внешний аккумулятор с быстрой зарядкой и дисплеем заряда.",
    price: 2490,
    image: powerBank, 
    category: "Электроника",
    inStock: true
  },
  {
    id: "4",
    name: "AirPods Pro аналог",
    description: "Беспроводные наушники с активным шумоподавлением и быстрым сопряжением.",
    price: 3490,
    image: airpodsPro,
    category: "Электроника",
    inStock: true
  },
  {
    id: "5",
    name: "Смарт-часы Sport",
    description: "Водонепроницаемые смарт-часы с пульсометром и GPS трекером.",
    price: 5990,
    image: "/api/placeholder/300/300",
    category: "Электроника",
    inStock: true
  },

  // Дом и быт
  {
    id: "6",
    name: "Фен для волос Pro",
    description: "Профессиональный фен с ионизацией и 3 режимами скорости.",
    price: 4990,
    image: "/api/placeholder/300/300",
    category: "Дом и быт",
    inStock: true
  },
  {
    id: "7",
    name: "Беспроводной пылесос",
    description: "Компактный ручной пылесос с HEPA фильтром и быстрой зарядкой.",
    price: 7990,
    image: "/api/placeholder/300/300",
    category: "Дом и быт", 
    inStock: true
  },
  {
    id: "8",
    name: "Увлажнитель воздуха",
    description: "Ультразвуковой увлажнитель с LED подсветкой и тихой работой.",
    price: 2290,
    image: "/api/placeholder/300/300",
    category: "Дом и быт",
    inStock: true
  },

  // Спорт и отдых
  {
    id: "9",
    name: "Фитнес браслет",
    description: "Умный браслет с мониторингом сна, пульса и активности.",
    price: 2490,
    image: "/api/placeholder/300/300",
    category: "Спорт и отдых",
    inStock: true
  },
  {
    id: "10",
    name: "Йога-мат премиум",
    description: "Профессиональный коврик для йоги из экологически чистых материалов.",
    price: 1890,
    image: "/api/placeholder/300/300",
    category: "Спорт и отдых",
    inStock: true
  },

  // Красота и здоровье
  {
    id: "11",
    name: "Массажер для лица",
    description: "Ультразвуковой массажер с функцией ионизации для ухода за кожей.",
    price: 3290,
    image: "/api/placeholder/300/300",
    category: "Красота и здоровье",
    inStock: true
  },
  {
    id: "12",
    name: "Набор косметики",
    description: "Профессиональный набор декоративной косметики для макияжа.",
    price: 4990,
    image: "/api/placeholder/300/300",
    category: "Красота и здоровье",
    inStock: true
  },

  // Одежда и обувь
  {
    id: "13",
    name: "Кроссовки спортивные",
    description: "Удобные кроссовки для бега и тренировок с амортизацией.",
    price: 5990,
    image: "/api/placeholder/300/300",
    category: "Одежда и обувь",
    inStock: true
  },
  {
    id: "14",
    name: "Толстовка унисекс",
    description: "Стильная толстовка из качественного хлопка с современным дизайном.",
    price: 2990,
    image: "/api/placeholder/300/300",
    category: "Одежда и обувь",
    inStock: true
  },

  // Авто и мото
  {
    id: "15",
    name: "Автодержатель магнитный", 
    description: "Универсальный магнитный держатель для телефона в автомобиль.",
    price: 790,
    image: carHolder,
    category: "Авто и мото",
    inStock: true
  },
  {
    id: "16",
    name: "Чехол для iPhone 15 Pro",
    description: "Прозрачный силиконовый чехол с усиленной защитой углов.",
    price: 890,
    image: phoneCase,
    category: "Авто и мото", 
    inStock: true
  },

  // Книги и хобби
  {
    id: "17",
    name: "Bluetooth колонка",
    description: "Портативная колонка с мощным басом и защитой от влаги IPX7.",
    price: 3290,
    image: "/api/placeholder/300/300",
    category: "Книги и хобби",
    inStock: true
  },
  {
    id: "18",
    name: "Настольная игра",
    description: "Увлекательная стратегическая игра для всей семьи.",
    price: 1590,
    image: "/api/placeholder/300/300",
    category: "Книги и хобби",
    inStock: true
  }
];