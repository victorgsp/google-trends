var express = require('express');
var router = express.Router();
let Parser = require('rss-parser');
const request = require('request');
const itemModule = require('./modules/models/item.js');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  await loadRss();
  res.send('respond with a resource');
});

String.prototype.replaceAll = function(valueToReplace, newValue){
  let newString = this;
  while (newString.indexOf(valueToReplace) >= 0) {
    newString = newString.replace(valueToReplace, newValue)
  }
  return newString;
}

async function loadRss() {
  request('https://trends.google.com.br/trends/trendingsearches/daily/rss?geo=BR', { json: true }, async (err, res, body) => {
    if (err) { return console.log(err); }

    body = body.replaceAll("ht:", "");
    body = body.replaceAll("+", "");

    let parserOptions = { customFields: { item: ['approx_traffic','news_item'] } };
    let parser = new Parser(parserOptions);

    let feed = await parser.parseString(body);
  
    let items = feed.items;
    items = items.sort((a,b)=>{
      return Number(b.approx_traffic.replace(",",".")) - Number(a.approx_traffic.replace(",","."));
    });

    feed.items.forEach(item => {
      console.log("--------------------------------------------------------------");
      console.log(`${item.title} (${item.approx_traffic})`);
      console.log(`Data: ${item.isoDate}`);
      console.log(`Data: ${item.link}`);
      console.log(`Data: ${item.pubDate}`);
    });
  });
}

const https = require('https');

module.exports = router;
