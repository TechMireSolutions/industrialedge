export type ProductStatus = "none" | "discount" | "new";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  status: ProductStatus;
  image: string;
  category: string;
  rating?: number;
  description?: string;
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Fold Duo Smartphone",
    price: 460,
    originalPrice: 530,
    status: "discount",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=400&fit=crop&q=80",
    category: "Smartphones & Tablets",
    rating: 4.5,
  },
  {
    id: "p2",
    name: "Studio Pro Headphones",
    price: 225,
    originalPrice: 300,
    status: "discount",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80",
    category: "Audio & Video",
    rating: 4.7,
  },
  {
    id: "p3",
    name: "MacBook Air M3",
    price: 1099,
    status: "new",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&q=80",
    category: "Computers & Laptops",
    rating: 4.9,
  },
  {
    id: "p4",
    name: "Pixel Watch 2",
    price: 299,
    originalPrice: 349,
    status: "discount",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&q=80",
    category: "Gadgets",
    rating: 4.3,
  },
  {
    id: "p5",
    name: "Gaming Console X",
    price: 499,
    status: "none",
    image:
      "https://images.unsplash.com/photo-1606181954474-675108d74477?w=400&h=400&fit=crop&q=80",
    category: "Video Games & Consoles",
    rating: 4.8,
  },
  {
    id: "p6",
    name: "4K OLED TV 65\"",
    price: 1299,
    originalPrice: 1499,
    status: "discount",
    image:
      "https://images.unsplash.com/photo-1593358286211-6456f959b68f?w=400&h=400&fit=crop&q=80",
    category: "TV & Audio",
    rating: 4.6,
  },
  {
    id: "p7",
    name: "Mirrorless Camera",
    price: 899,
    status: "new",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b2440326?w=400&h=400&fit=crop&q=80",
    category: "Cameras & Photos",
    rating: 4.7,
  },
  {
    id: "p8",
    name: "Mechanical Keyboard",
    price: 145,
    status: "none",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b82a339?w=400&h=400&fit=crop&q=80",
    category: "Accessories",
    rating: 4.4,
  },
  {
    id: "p9",
    name: "Smart Home Hub",
    price: 79,
    originalPrice: 99,
    status: "discount",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=400&h=400&fit=crop&q=80",
    category: "Gadgets",
    rating: 4.2,
  },
  {
    id: "p10",
    name: "Wireless Earbuds",
    price: 129,
    status: "new",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a889?w=400&h=400&fit=crop&q=80",
    category: "Audio & Video",
    rating: 4.5,
  },
  {
    id: "p11",
    name: "Ultrawide Monitor",
    price: 549,
    originalPrice: 649,
    status: "discount",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942dacac?w=400&h=400&fit=crop&q=80",
    category: "Computers & Laptops",
    rating: 4.6,
  },
  {
    id: "p12",
    name: "Drone 4K",
    price: 749,
    status: "none",
    image:
      "https://images.unsplash.com/photo-1509854131170-25c663971a4a?w=400&h=400&fit=crop&q=80",
    category: "Gadgets",
    rating: 4.4,
  },
];

export const productsByCategory: Record<string, Product[]> = {
  "Smartphones & Tablets": products.filter((p) => p.category === "Smartphones & Tablets"),
  "Computers & Laptops": products.filter((p) => p.category === "Computers & Laptops"),
  "Audio & Video": products.filter((p) => p.category === "Audio & Video"),
  "Video Games & Consoles": products.filter((p) => p.category === "Video Games & Consoles"),
  "TV & Audio": products.filter((p) => p.category === "TV & Audio"),
  "Cameras & Photos": products.filter((p) => p.category === "Cameras & Photos"),
  Accessories: products.filter((p) => p.category === "Accessories"),
  Gadgets: products.filter((p) => p.category === "Gadgets"),
};
