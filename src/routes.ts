import { createPlaywrightRouter, KeyValueStore } from "crawlee";
import { Page } from "playwright";
import dayjs from "dayjs";

const router = createPlaywrightRouter();

const PRODUCT_PAGE = "PRODUCT_PAGE";

router.addHandler(PRODUCT_PAGE, async ctx => {
  const { request, page, log } = ctx;
  log.info(`scraping ${request.url}`);
  await page.waitForSelector("[name='price']");
  await page.waitForSelector("[data-section='product-overview']");

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
  const date = dayjs().format("YYYY-MM-DD");
  await KeyValueStore.setValue(`${date}_${id}`, {
    url: request.url,
    price,
    price_original: originalPrice,
    dollars_off_s: dollars,
    percent_off_s: percent,
    dollars_off: Number(dollars?.replace("$", "")),
    percent_off: Number(percent?.replace("%", "")),
    title: await page.locator(".product-title").textContent(),
    brand: await page.locator(".product-details__brand--link").textContent(),
    description: await page.locator(".desktop-content-wrapper__main-description").textContent(),
  });
});

async function scrollToBottom(page: Page) {
  await page.evaluate(async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    for (let i = 0; i < document.body.scrollHeight; i += 100) {
      window.scrollTo(0, i);
      await delay(100);
    }
  });
}

router.addDefaultHandler(async ctx => {
  const { request, page, enqueueLinks, log } = ctx;

  await page.waitForSelector("#products-grid-0");

  await scrollToBottom(page);

  log.info(`Enqueueing pagination: ${request.url}`);
  await enqueueLinks({
    selector: "[data-type='product'] a",
    label: PRODUCT_PAGE,
  });
  log.info(`handle: ${request.url}`);
});

export { router };
