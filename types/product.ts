export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
  _local?: boolean;
  _ownerEmail?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type RegisteredUser = {
  email: string;
  username: string;
  passwordHash: string;
};