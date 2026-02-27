import { create } from "zustand";
import { Product } from "@/types/product";

function localKey(email: string) {
  return `sf_local_products_${email.toLowerCase()}`;
}

function loadLocalFromStorage(email: string): Product[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(localKey(email)) || "[]");
  } catch {
    return [];
  }
}

function saveLocalToStorage(email: string, products: Product[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(localKey(email), JSON.stringify(products));
}

type ProductsState = {
  apiProducts: Product[];
  localProducts: Product[];
  allProducts: Product[];
  setApiProducts: (products: Product[]) => void;
  addLocalProduct: (product: Omit<Product, "id">, ownerEmail: string) => void;
  loadUserProducts: (email: string) => void;
  clearUserProducts: () => void;
};

export const useProductsStore = create<ProductsState>()((set, get) => ({
  apiProducts: [],
  localProducts: [],
  allProducts: [],

  setApiProducts: (products) => {
    set({
      apiProducts: products,
      allProducts: [...products, ...get().localProducts],
    });
  },

  addLocalProduct: (productData, ownerEmail) => {
    const newId = Date.now();
    const newProduct: Product = {
      ...productData,
      id: newId,
      _local: true,
      _ownerEmail: ownerEmail,
    };
    const updated = [...get().localProducts, newProduct];
    saveLocalToStorage(ownerEmail, updated);
    set({
      localProducts: updated,
      allProducts: [...get().apiProducts, ...updated],
    });
  },

  loadUserProducts: (email) => {
    const local = loadLocalFromStorage(email);
    set({
      localProducts: local,
      allProducts: [...get().apiProducts, ...local],
    });
  },

  clearUserProducts: () => {
    set({
      localProducts: [],
      allProducts: [...get().apiProducts],
    });
  },
}));