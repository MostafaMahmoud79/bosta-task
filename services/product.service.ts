import axios from "axios";
import { Product } from "@/types/product";

const BASE_URL = "https://fakestoreapi.com";

export async function fetchProducts(): Promise<Product[]> {
  const res = await axios.get(`${BASE_URL}/products`);
  return res.data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await axios.get(`${BASE_URL}/products/${id}`);
  return res.data;
}

export async function fetchCategories(): Promise<string[]> {
  const res = await axios.get(`${BASE_URL}/products/categories`);
  return res.data;
}