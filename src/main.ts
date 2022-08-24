import { PlaywrightCrawler, log } from 'crawlee';
import { router as requestHandler } from "./routes";

// This is better set with CRAWLEE_LOG_LEVEL env var
// or a configuration option. This is just for show 😈
log.setLevel(log.LEVELS.DEBUG);

log.debug('Setting up crawler.');
const crawler = new PlaywrightCrawler({ requestHandler });

log.debug('Adding requests to the queue.');
await crawler.addRequests(['https://www.homedepot.com']);

// crawler.run has its own logs 🙂
await crawler.run();
