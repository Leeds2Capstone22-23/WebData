const puppeteer = require("puppeteer");



const getRedditPost = (async (url) => {
    let components = url.split('/');

    let post =  await puppeteer.launch({ headless: true, args: ['--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/107.0.5296.0 Safari/537.36"'] }).then(async browser => {

        const page = await browser.newPage();
        await page.goto(url, {
            waitUntil: "networkidle0",
        })
        await page.waitForSelector('body');
    
        var rposts = await page.evaluate(async () => {
    
            try {
                let post = document.querySelector('div > .Post' );

                let title = post.querySelector('h1').innerText;
                let user = post.querySelector('div > div > div > div > div > div > a').innerText;
                let published = [...post.querySelectorAll('div > div > div > div > span')]
                                    .map((e) => e.innerText)
                                    .filter((e) => !(e === '') && !(e === ' '))[1];

                let links = [...new Set([...post.querySelectorAll('a')]
                                .map((e) => e.getAttribute("href"))
                                .filter((e) => !e.includes("user") && !e.includes("/r/")))];

                let description = '';
                try {
                    description = post.querySelector('p').innerText;
                } catch(err) { /* Do nothing */}

                postItems = {
                    user: user, 
                    title: title, 
                    site: 'Reddit', 
                    text: description, 
                    // published date is relative to the date we pulled. Not useful
                    published: published,
                    links: links
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
    
        rposts.url = url
        rposts.page = "r/" + components[4];
        await browser.close();
        return rposts;
    
    }).catch(async (error) => {
        throw error;
    });

    return post;
});

module.exports = getRedditPost;