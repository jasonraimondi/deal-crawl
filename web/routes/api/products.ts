import { HandlerContext } from "$fresh/server.ts";

import { Client } from "pg/mod.ts";

export const handler = async (
  _req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const client = new Client(
    "postgresql://crawlee:secret@localhost:5432/crawlee",
  );

  const sql =
    `SELECT * FROM "Product" ORDER BY sale_date DESC, percent_off DESC`;

  await client.connect();
  const products = await client.queryObject(sql);

  await client.end();

  return new Response(JSON.stringify(products.rows), {
    headers: { "content-type": "application/json" },
  });
};
