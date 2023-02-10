const puppeteer = require("puppeteer");

// method called to combine reddit post data to document content
const compileRedditBody = (post) => {

    // Baseline content
    let content = 'Site: Reddit\n' +
                'User: ' + post.user + '\n' +
                'Subreddit: ' + post.page + '\n\n' +
                'Title: ' + post.title + '\n';

    // If text exists, include
    if (!(post.text === '')) {
        content = content + '\n' + post.text + '\n';
    }

    // If there are link or links
    if (post.link.length == 1 ) {
        content = content + '\nLink: ' + post.link[0] + '\n';
    } else if (post.link.length > 1 ) {
        content = content + '\nLinks:\n';
        for (let i = 0; i < post.link.length; i++) {
            content = content + post.link[i] + '\n';
        }
    }

    // combine to body
    let body = {
        site: post.site,
        url: post.url,
        content: content
    }

    return body
}


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
                    description = [...post.querySelectorAll('p')].map((e) => e.innerText).join('\n');
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

    // Compile post data to match API data
    const body = compileRedditBody(post);
    return body;
});

// exports
module.exports = getRedditPost;