import { centsToDollars } from "../lib/money.ts";
import { Product } from "../lib/db.ts";

type Props = {
  product: Product;
};

function usePercentOffColor(percent: number): string {
  let color = "text-green-500";

  if (percent < 9) {
    color = "text-gray-400";
  } else if (percent < 15) {
    color = "text-red-500";
  } else if (percent < 21) {
    color = "text-orange-400";
  } else if (percent < 24) {
    color = "text-orange-500";
  } else if (percent < 28) {
    color = "text-yellow-400";
  } else if (percent < 32) {
    color = "text-yellow-500";
  } else if (percent < 36) {
    color = "text-lime-400";
  } else if (percent < 40) {
    color = "text-lime-500";
  } else if (percent < 45) {
    color = "text-green-400";
  }

  return color;
}

export function ProductCard({ product }: Props) {
  const percentColor = usePercentOffColor(product.percent_off);
  // const opacity = (product.percent_off / 100) + 0.5;
  return (
    <ul className="border border-blue-500 p-2 m-2 flex flex-col justify-between">
      <li>
        <a className="text-blue-500 hover:text-blue-800" href={product.url}>
          <img src={product.image_urls[0]} alt={product.title + " image"} />
        </a>
      </li>
      <li className="text-xs text-gray-700">{product.brand}</li>
      <li className="text-sm font-semibold">{product.title}</li>
      <li className="text-sm text-gray-500">{product.sale_date}</li>
      <li className="flex justify-between items-center">
        <span className={["font-bold", percentColor].join(" ")}>
          {product.percent_off}% off
        </span>
        <span className={["text-lg", "font-semibold", percentColor].join(" ")}>
          {centsToDollars(product.price_sale)}
        </span>
      </li>
    </ul>
  );
}
