/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require("express");
var bodyParser = require("body-parser");
var http = require("https");

var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

const fetch = async (url) => {
  return new Promise((resolve, reject) => {
    http
      .get(url, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

/**********************
 * Example get method *
 **********************/

app.get("/crypto/:teamName/:date", async function (req, res) {
  // Add your code here
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  const getCryptoValue = async (teamName, date) => {
    const relevantCryptos = ["BTC", "ETH", "DOGE", "ADA"];
    const relevantCrypto = relevantCryptos.find((crypto) =>
      teamName.includes(crypto)
    );
    if (!relevantCrypto) {
      res.json({dollarValue: "N/A", url: req.url});
    }
    const unixTimeSeconds = Math.floor(Date.parse(date) / 1000);
    const secondsPerDay = MS_PER_DAY / 1000;
    const json = await fetch(
      `https://api.cryptowat.ch/markets/kraken/${relevantCrypto.toLowerCase()}usd/ohlc?after=${
        unixTimeSeconds - secondsPerDay
      }&before=${unixTimeSeconds}&periods=${secondsPerDay}&apikey=CJ0JFDUIIRVG2150Z5ED`
    );
    const [, openPrice] = JSON.parse(json).result[secondsPerDay].find(Boolean);
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    });

    return formatter.format(openPrice);
  };
  const dollarValue = await getCryptoValue(
    req.params.teamName,
    req.params.date
  );
  res.json({dollarValue, url: req.url});
});

app.listen(3000, function () {
  console.log("App started");
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
