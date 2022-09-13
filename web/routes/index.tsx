import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { ProductCard } from "../components/ProductCard.tsx";
import { db, Product } from "../lib/db.ts";
import { DateTimeFormatter } from "https://deno.land/std@0.155.0/datetime/formatter.ts";

const formatter = new DateTimeFormatter("YYYY-MM-DD");

export const handler: Handlers = {
  async GET(_req: Request, ctx: HandlerContext) {
    
    const sql =
      `SELECT * FROM "Product" WHERE sale_date="${formatter.format(new Date())}" ORDER BY sale_date DESC, percent_off DESC`;

    await db.connect();
    const products = await db.queryObject(sql);

    await db.end();

    return await ctx.render({ products: products.rows });
  },
};

export default function Page(props: PageProps<{ products: any[] }>) {
  return (
    <>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {props.data.products.map((p) => <ProductCard product={p} />) ??
          "No Content..."}
      </div>
    </>
  );
}
