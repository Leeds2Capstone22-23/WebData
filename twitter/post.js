
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
    }).catch(async (error) => {
      console.error(error)
      await browser.close();
      throw {error: "Twitter link invalid"};
    });

    const text = await page.$$eval('article div[lang]', (tweets) => {
      let x = tweets[0].textContent;
      return x;
    }).catch(async (error) => {
      // If no text (possible) leave blank
      return '';
    });


    const results = await page.$$eval("article ", async (tweets) => {
      if (!tweets || tweets == null || tweets.length == 0) return -1;
      tweets = tweets.splice(0, 1);
      let tweet = tweets[0];
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

        // get links for image(s)
        let _img = [...tweet.querySelectorAll("img")]
          .map((e) => e.getAttribute("src"))
          .filter((e) => !e.includes("profile_images") && !e.includes("emoji"));

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
          media: _img,
          published: _published,
          error: _error,
          site: "Twitter"
        };
      } catch (e) {
        console.error("puppeteer error");
        console.error(e);
        return 1;
      }
    });


    if (results == -1) {
      await browser.close();
      throw {error: "Twitter link invalid"};
    } else if (results == 0) {
      await browser.close();
      throw {error: "Unknown Twitter error"}
    } else if (results == 1) {
      await browser.close();
      throw {error: "Twitter access error"};
    }
    
    components = url.split('/');
    user = components[3];

    tweet = results;
    tweet.text = text;
    tweet.user = "@" + user;
    tweet.url = url;

    
    // TODO: handle if get replies = True ......... maybe we won't be doing this

    await browser.close()
    return tweet
})



async function runTest(url) {
  const res = await getPost(url, false)
  console.log(res)
}

module.exports = getPost;
