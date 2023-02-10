const puppeteer = require("puppeteer");

const getRedditPost = (async (url) => {
    components = url.split('/');

    // TODO: Change user agent
    return await puppeteer.launch({ headless: true, args: ['--user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/107.0.5296.0 Safari/537.36"'] }).then(async browser => {

        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('body');
    
        var rposts = await page.evaluate(async () => {
    
            try {
                let post = document.querySelector('div > .Post' );

                let title = post.querySelector('h1').innerText;
                let user = post.querySelector('div > div > div > div > div > div > a').innerText;

                let description = '';
                try {
                    description = post.querySelector('p').innerText;
                } catch(err) { /* Do nothing */}

                postItems = {user: user, title: title, url: '', site: 'Reddit', text: description, page: ''};
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
});

module.exports = getRedditPost;