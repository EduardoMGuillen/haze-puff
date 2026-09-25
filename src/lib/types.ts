export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  promo: boolean;
  active: boolean;
  createdAt: string;
};

export type ProductInput = Omit<Product, "id" | "createdAt"> & {
  id?: string;
};
