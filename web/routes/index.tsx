import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { ProductCard } from "../components/ProductCard.tsx";
import { db, Product } from "../lib/db.ts";

import { format } from "datetime";

export const handler: Handlers = {
  async GET(_req: Request, ctx: HandlerContext) {
    const twentyFourHours = 1000 * 60 * 60 * 24;
    const yesterday = format(new Date(Date.now() - twentyFourHours), "yyyy-MM-dd")
    const tomorrow = format(new Date(Date.now() + twentyFourHours), "yyyy-MM-dd");

    const sql =
      `SELECT * FROM "Product" WHERE sale_date BETWEEN '${yesterday}' AND '${tomorrow}' ORDER BY sale_date DESC, percent_off DESC`;

    await db.connect();
    const products = await db.queryObject(sql);

    await db.end();

    return await ctx.render({ products: products.rows });
  },
};

export default function Page(props: PageProps<{ products: Product[] }>) {
  const dateProducts = props.data.products.reduce((prev, next) => {
    if (!prev[next.sale_date]) prev[next.sale_date] = [];
    prev[next.sale_date].push(next)
    return prev;
  }, {} as Record<string, Product[]>)

  return (
    <>
      {Object.entries(dateProducts).map(([date, value]) => (
        <div>
          <p className="pl-2 pt-2 text-xl font-semibold">{date}</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {value.map((p) => <ProductCard product={p} />) ?? "No Content..."}
          </div>
        </div>
      ))}
    </>
  );
}
