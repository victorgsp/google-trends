let Parser = require('rss-parser');
const request = require('request');
const itemModel = require('../models/item.js');

String.prototype.replaceAll = function (valueToReplace, newValue) {
    let newString = this;
    while (newString.indexOf(valueToReplace) >= 0) {
        newString = newString.replace(valueToReplace, newValue)
    }
    return newString;
}

module.exports.loadRss = loadRss;

async function loadRss() {
    request('https://trends.google.com.br/trends/trendingsearches/daily/rss?geo=BR', { json: true }, async (err, res, body) => {
        if (err) { return console.log(err); }

        let items = await parseXmlToItems(body);
        await saveItems(items);
        await printItems();
    });
}

async function printItems() {
    let items = await itemModel.findAllItems();

    items = items.sort((a, b) => {
        return b.approx_traffic - a.approx_traffic;
    });

    items.forEach(item => {
        console.log("--------------------------------------------------------------");
        console.log(`${item.title} (${item.approx_traffic})`);
        console.log(`Data: ${item.isoDate}`);
        console.log(`Data: ${item.link}`);
        console.log(`Data: ${item.pubDate}`);
    });
}

async function saveItems(items) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await itemModel.insertOrUpdate(item);
    }
}

async function parseXmlToItems(body) {
    body = body.replaceAll("ht:", "");
    body = body.replaceAll("+", "");

    let parserOptions = { customFields: { item: ['approx_traffic', 'news_item'] } };
    let parser = new Parser(parserOptions);

    let feed = await parser.parseString(body);

    let items = feed.items;

    items = formatValues(items);

    return items;
}

function formatValues(items) {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.isoDate = new Date(item.isoDate);
        item.approx_traffic = Number(item.approx_traffic.replaceAll(",", ""));
    }
    return items;
}