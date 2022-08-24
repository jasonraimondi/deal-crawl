import "dotenv/config";

import { PlaywrightCrawler, log } from "crawlee";

import { router } from "./routes";

// This is better set with CRAWLEE_LOG_LEVEL env var
// or a configuration option. This is just for show 😈
// log.setLevel(log.LEVELS.DEBUG);

void (async function () {
  log.debug("Setting up crawler.");
  const crawler = new PlaywrightCrawler({
    requestHandler: router,
    headless: process.env.HEADLESS === "true",
    // maxConcurrency: 10,
    // maxRequestsPerMinute: 100,
    // browserPoolOptions: {
    //   useFingerprints: false,
    // },
  });

  log.debug("Adding requests to the queue.");
  await crawler.addRequests(["https://www.homedepot.com/SpecialBuy/SpecialBuyOfTheDay"]);
  await crawler.run();
})();
