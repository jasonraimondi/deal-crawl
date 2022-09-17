import scrollToBottom from "../utils/scroll-to-bottom";
import { playwrightRouter, ROUTES } from "./_routes";
import { Product } from "../../../web/lib/db";
import cuid from "cuid";

playwrightRouter.addHandler(ROUTES.lowes.root, async ctx => {
  const { request, page, enqueueLinks, log } = ctx;
  await page.waitForSelector("[data-automation-testid='ColumnControlV2']");
  await scrollToBottom(page);
  log.info(`Enqueueing pagination: ${request.url}`);
  await enqueueLinks({
    selector: "a.scaled-image-primary-link",
    label: ROUTES.lowes.detail,
  });
  log.info(`handle: ${request.url}`);
});

playwrightRouter.addHandler(ROUTES.lowes.detail, async ctx => {
  const { request, page, log } = ctx;
  log.info(`scraping ${request.url}`);

  await page.waitForSelector("#listItems");


  const percent = await page.$eval(".u__text--success", el => el.textContent?.match(/\d+%/g)?.[0]);

  // const product: Product = {
  //   url: request.url,
  //   image_urls,
  //   price_sale: Number(price?.replace("$", "") ?? 0) * 100,
  //   price_original: Number(originalPrice?.replace("$", "") ?? 0) * 100,
  //   discount_cents: Number(dollars?.replace("$", "") ?? 0) * 100,
  //   percent_off: Number(percent?.replace("%", "") ?? 0),
  //   title,
  //   brand,
  //   description: await page.locator(".desktop-content-wrapper__main-description").textContent(),
  //   id: cuid(),
  //   sale_date,
  //   created_at: new Date(),
  //   updated_at: null,
  // };

  // await prisma.product
  //   .findFirstOrThrow({ where: { sale_date, title, brand } })
  //   .catch(async () => await prisma.product.create({ data: product }));
});
