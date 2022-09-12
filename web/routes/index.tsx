import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { Client } from "pg/mod.ts";

export const handler: Handlers = {
  async GET(_req: Request, ctx: HandlerContext) {
    const client = new Client(
      "postgresql://crawlee:secret@localhost:5432/crawlee",
    );

    const sql =
      `SELECT * FROM "Product" ORDER BY sale_date DESC, percent_off DESC`;

    await client.connect();
    const products = await client.queryObject(sql);

    await client.end();

    return await ctx.render({ products: products.rows });
  },
};

export function toDollars(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

export function Product({ product }: any) {
  return (
    <ul className="border border-sm p-2 m-2">
      <li>{product.brand}</li>
      <li>{product.title}</li>
      <li><a className="text-blue-500 hover:text-blue-800" href={product.url}>link</a></li>
      <li>{toDollars(product.price_sale)}</li>
      <li>{product.percent_off}% off</li>
    </ul>
  );
}

export default function Page(props: PageProps<{ products: any[] }>) {
  return (
    <>
      <h1>Hello</h1>
      <ul>{props.data.products.map((p) => <li><Product product={p} /></li>)}</ul>
    </>
  );
}
