import { Client } from "pg/mod.ts";

export const db = new Client(Deno.env.get("DATABASE_URL") ?? "postgresql://crawlee:secret@localhost:5432/crawlee");
