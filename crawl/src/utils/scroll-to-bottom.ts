import { Page } from "playwright";

export default async function (page: Page) {
  await page.evaluate(async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    for (let i = 0; i < document.body.scrollHeight; i += 100) {
      window.scrollTo(0, i);
      await delay(100);
    }
  });
}