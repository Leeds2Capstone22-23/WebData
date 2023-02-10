
const puppeteer = require("puppeteer-extra");

const getPost = (async (url, getReplies) => {

    let browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        ignoreDefaultArgs: ["--disable-extensions"],
        args: ["--start-maximized", "--no-sandbox", "--disable-setuid-sandbox"],
    });

    let page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    const text = await page.$$eval('article div[lang]', (tweets) => {
      let x = tweets[0].textContent;
      return x;
    });

    const results = await page.$$eval("article ", (tweets) => {
      if (!tweets || tweets == null) return [];
      // tweets = tweets.splice(1, tweets.length);
      return tweets.map((tweet) => {
        try {
          if (!tweet || tweet == null) return 0;
          if (
            !tweet.querySelectorAll("time") ||
            tweet.querySelectorAll("time") == null ||
            !tweet.outerHTML
          )
            return 0;

          //fallback mechanism to enter null if selector cannot retreive

          let _published = null;
          let _error = null;
          let _url = [...tweet.querySelectorAll("a")]
            .map((e) => e.getAttribute("href"))
            .filter((e) => e.includes("status") && !e.includes("photo"))[0];

          try {
            //find tweetmap data

            _published = tweet
              .querySelectorAll("time")[0]
              .getAttribute("datetime");
          } catch (ex) {
            _error = ex.toString();
          }
          //populate tweetmap

          return {
            url: _url,
            published: _published,
            error: _error,
            site: "Twitter"
          };
        } catch (e) {
          console.log("puppeteer error");
          console.log(e);
          return 0;
        }
      });
    });

    let subTweetUrls = []
    subTweetUrls.push(...results.filter((e) => e !== 0));
    tweet = subTweetUrls[0]
    tweet.text = text

    
    // TODO: handle if get replies = True

    browser.close()
    return tweet
})



async function runTest(url) {
  const res = await getPost(url, false)
  console.log(res)
}


// runTest("https://twitter.com/statmuse/status/1585456495541772288")

module.exports = getPost;
