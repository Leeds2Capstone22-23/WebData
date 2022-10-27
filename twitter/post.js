
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

    // TODO: get user, likes, retweets, etc count

    // TODO: handle if get replies = True

    browser.close()
    return text
}



async function runTest() {
  const text = await getPost("https://twitter.com/statmuse/status/1585456495541772288", false)
  // const text = await getPost("https://twitter.com/jester42/status/1585316767689478145", false)
  console.log(text)
}


runTest()
