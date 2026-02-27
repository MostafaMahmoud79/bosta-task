import { create } from "zustand";
import { CartItem, Product } from "@/types/product";

function cartKey(email: string) {
  return `sf_cart_${email.toLowerCase()}`;
}

function loadCartFromStorage(email: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(cartKey(email)) || "[]");
  } catch {
    return [];
  }
}

function persistCartToStorage(email: string, items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(cartKey(email), JSON.stringify(items));
}

type CartState = {
  items: CartItem[];
  currentEmail: string | null;
  loadCart: (email: string) => void;
  unloadCart: () => void;
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  currentEmail: null,

  loadCart: (email) => {
    const items = loadCartFromStorage(email);
    set({ items, currentEmail: email });
  },

  unloadCart: () => {
    set({ currentEmail: null });
  },

  addItem: (product) => {
    const { items, currentEmail } = get();
    let updated: CartItem[];
    const existing = items.find((i) => i.product.id === product.id);
    if (existing) {
      updated = items.map((i) =>
        i.product.id === product.id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      );
    } else {
      updated = [...items, { product, quantity: 1 }];
    }
    set({ items: updated });
    if (currentEmail) persistCartToStorage(currentEmail, updated);
  },

  removeItem: (productId) => {
    const { items, currentEmail } = get();
    const updated = items.filter((i) => i.product.id !== productId);
    set({ items: updated });
    if (currentEmail) persistCartToStorage(currentEmail, updated);
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    const { items, currentEmail } = get();
    const updated = items.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    set({ items: updated });
    if (currentEmail) persistCartToStorage(currentEmail, updated);
  },

  clearCart: () => {
    const { currentEmail } = get();
    set({ items: [] });
    if (currentEmail) persistCartToStorage(currentEmail, []);
  },

  totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

  totalPrice: () =>
    get().items.reduce((acc, i) => acc + i.product.price * i.quantity, 0),
}));