import "dotenv/config";

import { PlaywrightCrawler } from "crawlee";

import { prisma } from "./db";
import { playwrightRouter, ROUTES } from "./routes/_routes";

const headless = process.env.HEADLESS !== "true";

void (async function () {
  await prisma.$connect();

  const crawler = new PlaywrightCrawler({ headless, requestHandler: playwrightRouter });

  await import("./routes/home-depot");
  await import("./routes/lowes");

  await crawler.addRequests([
    // {
    //   url: "https://www.homedepot.com/SpecialBuy/SpecialBuyOfTheDay",
    //   label: ROUTES.homeDepot.root,
    // },
    {
      url: "https://www.lowes.com/l/savings/daily-deals",
      label: ROUTES.lowes.root,
    },
  ]);

  const result = await crawler.run();
  console.log(result);
})()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
