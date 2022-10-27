
const puppeteer = require("puppeteer-extra");

async function getPost(url, getReplies) {

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
      tweets = tweets.splice(1, tweets.length);
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
          // let _text = null;
          let _replies = null;
          let _retweets = null;
          let _likes = null;
          let _error = null;
          let _url = [...tweet.querySelectorAll("a")]
            .map((e) => e.getAttribute("href"))
            .filter((e) => e.includes("status") && !e.includes("photo"))[0];

          try {
            //find tweetmap data

            _published = tweet
              .querySelectorAll("time")[0]
              .getAttribute("datetime");
            // _text = tweet.querySelectorAll("div[lang]").textContent
            console.log(_text)
            if (tweet.outerHTML.match("[0-9]+ .etweets"))
              _retweets = tweet.outerHTML
                .match("[0-9]+ .etweets")[0]
                .split(" ")[0];
            else
              _retweets = tweet.outerHTML
                .match("[0-9]+ .etweet")[0]
                .split(" ")[0];
            if (tweet.outerHTML.match("[0-9]+ .ikes"))
              _likes = tweet.outerHTML.match("[0-9]+ .ikes")[0].split(" ")[0];
            else
              _likes = tweet.outerHTML.match("[0-9]+ .ike")[0].split(" ")[0];
            if (tweet.outerHTML.match("[0-9]+ .eplies"))
              _replies = tweet.outerHTML
                .match("[0-9]+ .eplies")[0]
                .split(" ")[0];
            else
              _replies = tweet.outerHTML
                .match("[0-9]+ .eply")[0]
                .split(" ")[0];
          } catch (ex) {
            _error = ex.toString();
          }
          //populate tweetmap

          return {
            url: _url,
            // text: _text,
            published: _published,
            replies: _replies,
            retweets: _retweets,
            likes: _likes,
            error: _error,
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
}



async function runTest() {
  const text = await getPost("https://twitter.com/statmuse/status/1585456495541772288", false)
  // const text = await getPost("https://twitter.com/jester42/status/1585316767689478145", false)
  console.log(text)
}


runTest()
