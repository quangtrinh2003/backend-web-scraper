const { scrollToFooter, parsePostDate, insertDB } = require("./utils.js");
const { checkNew, checkLatest } = require("./utils");
const { chromium } = require("playwright");

async function postScrape(atcArr, browserContext, table) {
  try {
    for (let e of atcArr) {
      console.log("blabla");
      const page = await browserContext.newPage();
      await page.goto(e["url"], {
        timeout: 600000,
      });
      const article = page.locator(
        ".detail-content.afcbc-body > p, .detail-sapo",
      );
      const articleLength = await article.count();
      let text = "";
      for (let i = 0; i < articleLength; i++) {
        text += (await article.nth(i).textContent()) + " ";
      }
      e["article"] = text || " ";
    }
    await insertDB(atcArr, table);
  } catch (e) {
    console.log("Timeout, continue");
  }
}

exports.mainPageScrape = async (category, topic) => {
  console.log("Running");
  const browser = await chromium.launch();
  const browserContext = await browser.newContext({
    baseURL: process.env.BASE_URL,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  });
  const atcArr = [];
  const page = await browserContext.newPage();
  await page.goto(category);

  await scrollToFooter(page);
  const headings = await page.locator(
    "#load-list-news .box-category-link-with-avatar",
  );
  const latestNews = await checkLatest(topic);
  const headingsCount = await headings.count();
  for (let i = headingsCount - 1; i >= 0; i--) {
    console.log(i);
    const title = await headings.nth(i).getAttribute("title");
    const url = await headings.nth(i).getAttribute("href");
    if (url !== latestNews) {
      atcArr.push({
        title: title,
        url: url,
        timestamp: Date.now(),
      });
    }
  }
  if (atcArr.length !== 0) {
    await postScrape(atcArr, browserContext, topic);
  }
  await browserContext.close();
  await browser.close();
};
