// This file may experience a name change soon in order to align with the rest of the project ("twitter/twitter.js")

// Pieces of this are pulled from
// https://javascript.plainenglish.io/how-to-scrape-twitter-data-with-depth-first-recursion-afbd437472b5
// Then it was edited to suit our needs
const puppeteer = require("puppeteer-extra");

// Function to gather twitter data
// getReplies was intended as a boolean to use for the recursive comment crawler. Currently, always set to false and never called. We may not use this
const getTwitterPost = (async (url, getReplies) => {

  // If time permits, I may be able to reformat this to match with the regular puppeteer calls used for other sites, rather than puppeteer-extra

  // launch puppeteer
    let browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null,
        ignoreDefaultArgs: ["--disable-extensions"],
        args: ["--start-maximized", "--no-sandbox", "--disable-setuid-sandbox"],
    });

    let page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    // navigate to page
    await page.goto(url, {
      waitUntil: "networkidle0",
    }).catch(async (error) => {
      console.error(error)
      await browser.close();
      throw {error: "Twitter link invalid"};
    });

    // gather text (if it exists)
    const text = await page.$$eval('article div[lang]', (tweets) => {
      let x = tweets[0].textContent;
      return x;
    }).catch(async (error) => {
      // If no text (possible) leave blank
      return '';
    });


    // evaluate 'article's which are all the tweets including comments
    let tweet = await page.$$eval("article ", async (tweets) => {

      // If no articles are found the link is not a post link
      if (!tweets || tweets == null || tweets.length == 0) return -1;

      // For the goal tweet, we only need the first article
      let tweet = tweets[0];
      try {
        // If there is no tweet there or time then the link is not valid
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

        // get links for image(s), the array will be empty if there are no images
        let _img = [...tweet.querySelectorAll("img")]
          .map((e) => e.getAttribute("src"))
          // profile images and emojis are stores as images and found within the article. We can filter these out
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
          link: _img,
          published: _published,
          error: _error,
          site: "Twitter"
        };
      } catch (e) {
        // an unexpected puppeteer error occured
        console.error("puppeteer error");
        console.error(e);
        return 1;
      }
    });


    // catch errors here to be able to close the browser
    if (tweet == -1) {
      await browser.close();
      throw {error: "Twitter link invalid"};

    } else if (tweet == 0) {
      await browser.close();
      throw {error: "Unknown Twitter error"}

    } else if (tweet == 1) {
      await browser.close();
      throw {error: "Twitter access error"};
    }
    
    

    // populate data found outside of the main section
    tweet.text = text;
    tweet.url = url;

    components = url.split('/');
    user = components[3];
    tweet.user = "@" + user;

    
    // TODO: handle if get replies = True ..... maybe we won't be doing this

    // close puppeteer
    await browser.close()
    return tweet
})


// exports
module.exports = getTwitterPost;
