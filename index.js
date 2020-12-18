const fetch = require("node-fetch");
const cheerio = require("cheerio");
const Sheet = require("./google-conn");
const _ = require("lodash");

log = console.log;

const getPage = async (i) => {
  const res = await fetch(
    `https://explodingtopics.com/topics-this-month?page=${i}`
  );
  const text = await res.text();
  // const found = text.toLowerCase().includes("prime gaming");

  const $ = cheerio.load(text);
  const containers = $(".topicInfoContainer").toArray();

  const trending = containers.map((c) => {
    const active = $(c);
    const keyword = active.find(".tileKeyword").text();
    const description = active.find(".tileDescription").text();
    const search = active.find(".scoreTagItem").first().text();

    return { keyword, description, search };
  });

  return trending;
};

const getAllPages = async () => {
  let i = 1;
  let allTrends = [];

  while (true) {
    const allTrend = await getPage(i);

    if (_.isEmpty(allTrend) === true) break;

    allTrends = [...allTrends, ...allTrend];
    i++;
    log(i);
  }

  return allTrends;
};

(async function () {
  const trending = await getAllPages();

  // google sheet setup
  const sheet = new Sheet();
  await sheet.loadCredentials();

  //   await sheet.headerValues(["hello", "email"]);

  const rows = await sheet.getRow();
  const kSearch = rows.map((c) => {
    return c.keyword;
  });

  const filterTrends = trending.filter((t) => {
    return kSearch.indexOf(t.keyword) < 0;
  });

  await sheet.addRows(filterTrends, i);

  // google sheet setup
  const sheet = new Sheet();
  await sheet.loadCredentials();

  // //   await sheet.headerValues(["hello", "email"]);

  rawIndex = await sheet.addSheet(
    `electronics garget ${new Date().getMinutes()}`,
    ["keyword", "description", "search"]
  );

  await sheet.addRows(allDetials, rawIndex);
  log("saving to google sheet");
})();

// test

// (async function () {
//   const res = await fetch(`https://www.gourmethunters.com/en_US/wines/White`);
//   const text = await res.text();
//   const found = text.toLowerCase().includes("protocolo");
//   log(found);
// })();
