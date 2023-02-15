const puppeteer = require("puppeteer");


// Pull relevent data from Reddit post
const getRedditPost = (async (url) => {

    // Launch puppeteer
    let post =  await puppeteer.launch({ headless: true, args: ['--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/107.0.5296.0 Safari/537.36"'] }).then(async browser => {

        const page = await browser.newPage();

        // go to url
        await page.goto(url, {
            waitUntil: "networkidle0",
        })
        await page.waitForSelector('body');
    
        // evaluate page
        var rposts = await page.evaluate(async () => {
    
            try {
                // find post
                let post = document.querySelector('div > .Post' );

                // gather data
                let title = post.querySelector('h1').innerText;
                let user = post.querySelector('div > div > div > div > div > div > a').innerText;
                let published = [...post.querySelectorAll('div > div > div > div > span')]
                                    .map((e) => e.innerText)
                                    .filter((e) => !(e === '') && !(e === ' '))[1];

                let link = [...new Set([...post.querySelectorAll('a')]
                                .map((e) => e.getAttribute("href"))
                                .filter((e) => !e.includes("user") && !e.includes("/r/")))];

                let description = '';
                try {
                    description = post.querySelector('p').innerText;
                } catch(err) { /* Do nothing */}

                // compile found data
                postItems = {
                    user: user, 
                    title: title, 
                    site: 'Reddit', 
                    text: description, 
                    // published date is relative to the date we pulled. Not useful
                    published: published,
                    link: link
                };
                return postItems;

            } catch (err)  {
                await browser.close();
                throw {error: "Reddit link invalid"};
            };

            
            
        }).catch(async (error) => {
            await browser.close();
            throw {error: "Reddit link invalid"};
        });
    
        // fill elements that can be filled from the url
        rposts.url = url

        // Split url to extract subreddit
        let components = url.split('/');
        rposts.page = "r/" + components[4];

        // close puppeteer
        await browser.close();
        return rposts;
    
    }).catch(async (error) => {
        throw error;
    });

    // TODO: Compile data into single body to align with document storage
    return post;
});

// exports
module.exports = getRedditPost;