import { Product } from "@deal-crawl/prisma";
import dayjs from "dayjs";
import cuid from "cuid";

import { prisma } from "../db";
import scrollToBottom from "../utils/scroll-to-bottom";
import { playwrightRouter, ROUTES } from "./_routes";

playwrightRouter.addHandler(ROUTES.homeDepot.root, async ctx => {
  const { request, page, enqueueLinks, log } = ctx;
  await page.waitForSelector("#products-grid-0");
  await scrollToBottom(page);
  log.info(`Enqueueing pagination: ${request.url}`);
  await enqueueLinks({
    selector: "[data-type='product'] a",
    label: ROUTES.homeDepot.detail,
  });
  log.info(`handle: ${request.url}`);
});

playwrightRouter.addHandler(ROUTES.homeDepot.detail, async ctx => {
  const { request, page, log } = ctx;
  log.info(`scraping ${request.url}`);
  await page.waitForSelector("[name='price']");
  await page.waitForSelector("[name='product-details']");

  const id = new URL(request.url).pathname.split("/")[2];
  const originalPrice = await page.locator(".u__strike").textContent();
  const dollars = await page.$$eval(".u__text--success span", ([el]) => el.textContent);
  const percent = await page.$eval(".u__text--success", el => el.textContent?.match(/\d+%/g)?.[0]);
  const price = await page.$eval(".price-format__main-price", el => {
    const arr = el.textContent?.split("") ?? [];
    if (arr.length > 1) arr.splice(arr.length - 2, 0, ".");
    return arr.join("");
  });
  log.info("saving data");

  // saving result of map to default Key-value store
  const sale_date = dayjs().format("YYYY-MM-DD");
  const title = await page.locator(".product-title").textContent();
  const brand = await page.locator(".product-details__brand--link").textContent();

  const image_urls = await page.$$eval(".mediagallery__mainimageblock img[src]", (imgs: HTMLImageElement[]) => imgs.map(img => img.src));

  const product: Product = {
    url: request.url,
    image_urls,
    price_sale: Number(price?.replace("$", "") ?? 0) * 100,
    price_original: Number(originalPrice?.replace("$", "") ?? 0) * 100,
    discount_cents: Number(dollars?.replace("$", "") ?? 0) * 100,
    percent_off: Number(percent?.replace("%", "") ?? 0),
    title,
    brand,
    description: await page.locator(".desktop-content-wrapper__main-description").textContent(),
    id: cuid(),
    sale_date,
    created_at: new Date(),
    updated_at: null,
  };

  log.info(JSON.stringify(product, null, 2));

  await prisma.product
    .findFirstOrThrow({ where: { sale_date, title, brand } })
    .catch(async () => await prisma.product.create({ data: product }));
});
