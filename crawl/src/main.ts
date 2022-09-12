import "dotenv/config";

import { log, PlaywrightCrawler } from "crawlee";

import { router } from "./routes";
import { prisma } from "./db";

void (async function () {
  await prisma.$connect();

  log.debug("Setting up crawler.");
  const crawler = new PlaywrightCrawler({
    requestHandler: router,
    headless: process.env.HEADLESS !== "true",
  });
  log.debug("Adding requests to the queue.");
  await crawler.addRequests(["https://www.homedepot.com/SpecialBuy/SpecialBuyOfTheDay"]);
  await crawler.run();
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
