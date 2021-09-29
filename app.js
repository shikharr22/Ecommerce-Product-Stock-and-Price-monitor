const got = require("got");
const HTMLparser = require("node-html-parser");
const prompt = require("prompt-sync")();
const notifier = require("node-notifier");
const path = require("path");

var stockText;

const Monitor = async (productLink) => {
  var myHeaders = {
    authority: "www.amazon.in",
    method: "GET",
    path: "/OnePlus-Nord-Blue-128GB-Storage/dp/B097RD2JX8/ref=sr_1_1?dchild=1&keywords=nord&qid=1632751188&sr=8-1",
    scheme: "https",
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "cache-control": "max-age=0",
    downlink: "4.2",
    ect: "4g",
    rtt: "100",
    "sec-ch-ua":
      '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "service-worker-navigation-preload": "true",
    "upgrade-insecure-requests": "1",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
  };

  const response = await got(productLink, { headers: myHeaders });

  if (response && response.statusCode == 200) {
    const root = HTMLparser.parse(response.body);

    let productName = root.querySelector("#productTitle");
    if (productName) {
      productName = productName.innerText.trim();
      console.log(productName);
    }
    let productPrice = root.querySelector("#priceblock_dealprice");
    let productDealPrice=root.querySelector("#priceblock_ourprice");
    if (productDealPrice) {
      productDealPrice =productDealPrice.innerText.trim().toString();
      let comma=productDealPrice.indexOf(",")
      let decimal=productDealPrice.indexOf('.');
      productDealPrice=productDealPrice.substring(1,comma)+productDealPrice.substring(comma+1,decimal);
      console.log(productDealPrice);
    }
    else
    {
        productPrice =productPrice.innerText.trim().toString();
        let comma=productPrice.indexOf(",")
        let decimal=productPrice.indexOf('.');
        productPrice=productPrice.substring(1,comma)+productPrice.substring(comma+1,decimal);
        console.log(productPrice);
    }
    let stock = root.querySelector("#availability");
    let outOfStock=root.querySelector("#outOfStock");
    if (outOfStock) {
             console.log("OUT OF STOCK");
      } 
    else {
        stockText = stock.childNodes[1].innerText.substring(0,25).trim().toLowerCase();
        console.log("IN STOCK!!");
        clearInterval(id);
        notifier.notify({
          title: "IN STOCK",
          message: `${productName}`,
          icon: "C:\\Users\\Shikhar Raizaday\\Desktop\\PROJECT\\Product  Monitor\\shop.png",
          sound:true,
        });
      }
    }
  }

var id = 0;
const Run = async () => {
  var productLink = prompt("Enter the Product Link to monitor: ");
  id = setInterval(() => {
    Monitor(productLink);
  }, 5000);
};

Run();
