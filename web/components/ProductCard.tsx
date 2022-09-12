import { centsToDollars } from "../lib/money.ts";
import { Product } from "../lib/db.ts"

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <ul className="border border-blue-500 p-2 m-2 flex flex-col justify-between">
      <li><img src={product.image_urls[0]} alt={product.title + " image"} /></li>
      <li className="text-xs text-gray-700">{product.brand}</li>
      <li className="text-sm font-semibold">{product.title}</li>
      <li className="text-sm text-gray-500">{product.sale_date}</li>
      <li>
        <a className="text-blue-500 hover:text-blue-800" href={product.url}>
          link
        </a>
      </li>
      <li className="flex justify-between items-center">
        <span className="font-bold">{product.percent_off}% off</span>
        <span className="text-lg font-semibold">{centsToDollars(product.price_sale)}</span>
      </li>
    </ul>
  );
}
