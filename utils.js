const MAX_SCROLL_ITERATION = 0;
const db = require("./server.js");
const pgp = require("pg-promise")({
  capSQL: true,
});

exports.scrollToFooter = async (page) => {
  for (let i = 0; i <= MAX_SCROLL_ITERATION; i++) {
    await page.locator(".footer").scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    if (await page.locator(".view-more").isVisible()) {
      await page.locator(".view-more").click();
    }
    await page.waitForTimeout(500);
  }
};

exports.parsePostDate = (url) => {
  return url.match(/(\d+)\.htm$/)[1];
};

exports.insertDB = async (atcArr, table) => {
  const query = pgp.helpers.insert(
    atcArr,
    ["timestamp", "url", "title", "article"],
    table,
  );
  await db.none(query);
};

exports.checkLatest = async (topic) => {
  const result = await db.any(
    `SELECT * FROM ${topic} ORDER BY timestamp desc LIMIT 1`,
  );
  console.log(result);
  if (result.length === 0) {
    return "";
  }
  return result[0].url;
};

exports.getAllNews = async (req, res) => {
  const result = await db.any(
    `SELECT * FROM ${req.params["id"]} ORDER BY timestamp desc`,
  );
  res.status(200).json({ data: result });
};
