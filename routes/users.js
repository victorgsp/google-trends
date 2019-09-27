var express = require('express');
var router = express.Router();
let Parser = require('rss-parser');
const request = require('request');

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

    let parserOptions = { customFields: { item: ['approx_traffic','news_item'] } };
    let parser = new Parser(parserOptions);

    let feed = await parser.parseString(body);
    console.log("==================>feed.items[0]",feed.items[1]);
  });
  // feed.items.forEach(item => {
  //   console.log(item.title + ':' + item.link)
  // });
  // console.log("==================>feed.items[0]",feed.items[0]);


}

const https = require('https');

module.exports = router;
