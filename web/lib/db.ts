import { Client } from "pg/mod.ts";

export const db = new Client(
  Deno.env.get("DATABASE_URL") ??
    "postgresql://crawlee:secret@localhost:5432/crawlee",
);

export type Product = {
  id: string;
  url: string;
  image_urls: string[];
  title: string | null;
  brand: string | null;
  description: string | null;
  price_sale: number;
  price_original: number;
  discount_cents: number;
  percent_off: number;
  sale_date: string;
  created_at: Date;
  updated_at: Date | null;
};
