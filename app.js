const scrapeService = require("./scrapeService.js");
const express = require("express");
const morgan = require("morgan");
const appRouting = require("./appRouting.js");
const cors = require("cors");
const app = express();

async function scrape() {
  await scrapeService.mainPageScrape("/thoi-su.htm", "thoisu");
  await scrapeService.mainPageScrape("/the-gioi.htm", "thegioi");
  await scrapeService.mainPageScrape("/phap-luat.htm", "phapluat");
  await scrapeService.mainPageScrape("/kinh-doanh.htm", "kinhdoanh");
}

app.use(cors({ origin: "*" }));
app.use(morgan("dev"));
app.use(express.json());
app.use(appRouting);
app.listen(3030, "localhost", async () => {
  console.log("connected");
  await scrape();
  setInterval(scrape, 1800000);
});
