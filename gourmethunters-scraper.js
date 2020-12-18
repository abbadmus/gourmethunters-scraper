const fetch = require("node-fetch");
const cheerio = require("cheerio");
const Sheet = require("./google-conn");
const _ = require("lodash");
const fs = require("fs").promises;
const sleep = require("util").promisify(setTimeout);
// const moment = require("moment");

log = console.log;

const fields = [
  "product_name",
  "price",
  "parker_points",
  "penin_points",
  "type_of_wine",
  "pairing",
  "style",
  "winery",
  "size",
  "country",
  "region",
  "apellation",
  "alcohol",
  "grapes",
  "wine_making",
  "serving",
  "product_description",
  "url",
  "image_url",
];

// "https://www.gourmethunters.com/en_US/wines/Red",
// "https://www.gourmethunters.com/en_US/wines/White",
// "https://www.gourmethunters.com/en_US/wines/Sparkling",
// "https://www.gourmethunters.com/en_US/wines/Ros%C3%A9",
// "https://www.gourmethunters.com/en_US/wines/Sweet",
// "https://www.gourmethunters.com/en_US/wines/Fortified",
// "https://www.gourmethunters.com/en_US/spirits",
// "https://www.gourmethunters.com/en_US/wines/Extra_NA",

const categoryToBeScrape = [
  "https://www.gourmethunters.com/en_US/wines/Red",
  "https://www.gourmethunters.com/en_US/wines/White",
  "https://www.gourmethunters.com/en_US/wines/Sparkling",
  "https://www.gourmethunters.com/en_US/wines/Ros%C3%A9",
  "https://www.gourmethunters.com/en_US/wines/Sweet",
  "https://www.gourmethunters.com/en_US/wines/Fortified",
  "https://www.gourmethunters.com/en_US/spirits",
  "https://www.gourmethunters.com/en_US/wines/Extra_NA",
];

const getLinks = async (url, i) => {
  try {
    log(`${url}?page=${i}`);
    const res = await fetch(`${url}?page=${i}`);
    const text = await res.text();

    const $ = cheerio.load(text);
    const containers = $("div.title_container > h4").toArray();
    log(containers.length);

    const productLinks = containers.map(async (c) => {
      const active = $(c);
      const link = active.find("a").attr("href");

      sleep(500);
      return `https://www.gourmethunters.com${link}`;
    });

    return Promise.all(productLinks);
  } catch (error) {
    log(`Unable to scrape ${url}`);
  }
};

const getAllLinks = async (url) => {
  let i = 1;
  let allLinks = [];

  while (true) {
    const getlink = await getLinks(url, i);

    if (_.isEmpty(getlink) === true) break;

    allLinks = [...allLinks, ...getlink];
    i++;
    log(i);
    sleep(500);
  }

  return allLinks;
};

const eachCategory = async (urls) => {
  let combineLink = [];
  for (let url of urls) {
    allLinks = await getAllLinks(url);

    combineLink = [...combineLink, ...allLinks];
    sleep(2000);
  }

  return combineLink;
};

const productDetails = async (urls) => {
  let allProductDetails = [];

  for (let url of urls) {
    try {
      log(url);
      const res = await fetch(encodeURI(url));
      log(res.status);
      const text = await res.text();
      url = res.url;

      const $ = cheerio.load(text);

      const rawProduct_name = $("h1").text();
      const product_name = rawProduct_name.replace(/\n/g, "").trim();

      const rawPrice = $(".no-padding-right > div:nth-child(1) > div > p")
        .first()
        .text();
      const price = rawPrice.replace(/\n/g, "").trim();

      const parker_points = $(
        "div.points > div > div:nth-child(1) > div > span:nth-child(2)"
      )
        .text()
        .replace(/\n/g, "")
        .trim();

      const penin_points = $(
        "div.points > div > div:nth-child(2) > div > span:nth-child(2)"
      )
        .text()
        .replace(/\n/g, "")
        .trim();

      const type_of_wine = $(
        "div:nth-child(1) > div:nth-child(1) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div.des_featured> p"
      )
        .text()
        .replace(/\n/g, "")
        .trim();

      const pairing = $(
        "div:nth-child(1) > div:nth-child(2) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div.des_featured> p"
      )
        .text()
        .replace(/\n/g, "")
        .trim();

      const style = $(
        "div:nth-child(2) > div:nth-child(1) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div.des_featured> p"
      )
        .text()
        .replace(/\n/g, "")
        .trim();

      const winery = $(
        "div:nth-child(3) > div:nth-child(1) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div.des_featured> p"
      )
        .text()
        .replace(/\n/g, "")
        .trim();

      const size = $(
        "div:nth-child(3) > div:nth-child(2) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div.des_featured> p"
      )
        .text()
        .replace(/\n/g, "")
        .trim();

      const country = $(
        "div:nth-child(4) > div:nth-child(1) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div.des_featured> p"
      )
        .text()
        .replace(/\n/g, "")
        .trim();

      const region = $(
        "div:nth-child(4) > div:nth-child(2) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div.des_featured> p"
      )
        .text()
        .replace(/\n/g, "")
        .trim();

      const apellation = $(
        "div:nth-child(5) > div:nth-child(1) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div.des_featured> p"
      )
        .text()
        .replace(/\n/g, "")
        .trim();

      const alcohol = $(
        "div:nth-child(5) > div:nth-child(2) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div.des_featured> p"
      )
        .text()
        .replace(/\n/g, "")
        .trim();

      const grapes = $(
        "div:nth-child(6) > div:nth-child(1) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div.des_featured> p"
      )
        .first()
        .text()
        .replace(/\n/g, "")
        .trim();

      const wine_making = $(
        "div:nth-child(6) > div:nth-child(2) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div.des_featured> p"
      )
        .first()
        .text()
        .replace(/\n/g, "")
        .trim();

      const serving = $(
        "div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div > p"
      )
        .first()
        .text()
        .replace(/\n/g, "")
        .trim();

      const product_description = $(".description_product_detail")
        .text()
        .replace(/\n/g, "")
        .trim();

      const image_url = encodeURI($("div.item.zb.active > img").attr("src"));

      allProductDetails.push({
        product_name,
        price,
        parker_points,
        penin_points,
        type_of_wine,
        pairing,
        style,
        winery,
        size,
        country,
        region,
        apellation,
        alcohol,
        grapes,
        wine_making,
        serving,
        product_description,
        url,
        image_url,
      });
      sleep(500);
    } catch (error) {
      log(error.message);

      log(`Unable to scrape ${url}`);
      continue;
    }
  }

  return allProductDetails;
};

(async function () {
  const allLinks = await eachCategory(categoryToBeScrape);

  const allProductDetails = await productDetails(allLinks);

  jsonallProductDetails = JSON.stringify(allProductDetails);

  await fs.writeFile("./test.json", jsonallProductDetails, "utf8");

  //   log(allProductDetails);

  // google sheet setup
  const sheet = new Sheet();
  await sheet.loadCredentials();

  // //   await sheet.headerValues(["hello", "email"]);

  // date = moment().format("MMMM Do YYYY, h:mm:ss a").replace(/:/g, "-");

  date = new Date().getMinutes();

  rawIndex = await sheet.addSheet(`gourmethunters ${date}`, fields);

  await sheet.addRows(allProductDetails, rawIndex);
  log("saving to google sheet");
})();
