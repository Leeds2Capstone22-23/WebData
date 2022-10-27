// https://javascript.plainenglish.io/how-to-scrape-twitter-data-with-depth-first-recursion-afbd437472b5
// const { run } = require("node:test");
const puppeteer = require("puppeteer-extra");
var Sentiment = require("sentiment");
// import {runReplies} from replies.js
const sentiment = (text) => new Sentiment().analyze(text);
let post = async function (comment_object) {
  console.log(comment_object);
};
let getIdFromTwitterUrl = function (url) {
  return url.split("/")[url.split("/").length - 1];
};
let yOffsetMap = [];
let visitedUrls = [];
let tweetMap = {};
async function autoScroll(num_scrolls, page) {
  let offsets = await page.evaluate(async (num_scrolls) => {
    return await new Promise((resolve, reject) => {
      var distance = 100;
      var scrollCount = 0;
      var totalHeight = 0;
      var timer = setInterval(() => {
        scrollCount++;

        window.scrollBy(0, distance);

        totalHeight += distance;
        if (scrollCount >= num_scrolls) {
          clearInterval(timer);
          resolve(window.pageYOffset);
        }
      }, 100);
    });
  }, num_scrolls);
  yOffsetMap = yOffsetMap.map((e) => {
    if (e.id === page.mainFrame()._id) {
      if (!e.offsets) e.offsets = [];
      e.offsets.push(offsets);
      return { id: e.id, offsets: e.offsets };
    }
    return e;
  });
}
function checkDoneScrolling(id) {
  let answer = false;
  yOffsetMap.forEach((e) => {
    if (e.id.toString() == id.toString()) {
      if (!e.offsets || e.offsets.length < 11) return;
      if (
        e.offsets[e.offsets.length - 1].toString() ==
        e.offsets[e.offsets.length - 10].toString()
      ) {
        answer = true;
      }
    }
  });
  return answer;
}

async function getPost(url, getReplies) {
    // url = "httlp://twitter.com/search?q=" + keyword + "&src=typed_query";

    let browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        ignoreDefaultArgs: ["--disable-extensions"],
        args: ["--start-maximized", "--no-sandbox", "--disable-setuid-sandbox"],
    });

    let page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    yOffsetMap.push({ id: page.mainFrame()._id });

    await page.goto(url, {
      waitUntil: "networkidle0",
    });


    // TODO: get searched tweets than call replies if getReplies set to true
    const text = await page.$$eval('article div[lang]', (tweets) => {
      let x = tweets.map((tweet) => tweet.textContent);
      return x;
    });
    // console.log(text);

    // if (getReplies) {
    //     replyUrls = []
    // }
    // let _published = null;
    // let _replies = null;
    // let _retweets = null;
    // let _likes = null;
    // let _error = null;
    // let _url = url;

    // if (getReplies) {
    //     // urls with replies
    //     for (i=0; i< length(replyUrls); i++) {
    //         runReplies(replyUrls[i])
    //     }
    // }

    browser.close()
    // TODO: setup as return
    console.log(text)
}

// document.querySelector("#data-id__tweetText > span")
//*[@id="id__flahm0oegc8"]/span


// getPost("https://twitter.com/jester42/status/1585316767689478145", fa
getPost("https://twitter.com/statmuse/status/1585456495541772288", false)
