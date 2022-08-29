import "dotenv/config";

import { PlaywrightCrawler, log } from "crawlee";

import { router } from "./routes";

void (async function () {
  log.debug("Setting up crawler.");
  const crawler = new PlaywrightCrawler({
    requestHandler: router,
    headless: process.env.HEADLESS !== "true",
  });
  log.debug("Adding requests to the queue.");
  await crawler.addRequests(["https://www.homedepot.com/SpecialBuy/SpecialBuyOfTheDay"]);
  await crawler.run();
})();
