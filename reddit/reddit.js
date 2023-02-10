// const fs = require('fs');
// const request = require('request');
const puppeteer = require("puppeteer");

const getRedditPost = (async (url) => {
    components = url.split('/');

    // TODO: Change user agent
    return await puppeteer.launch({ headless: true, args: ['--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"'] }).then(async browser => {

        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector('body');
        // await page.wa
    
        var rposts = await page.evaluate(() => {
    
            let post = document.querySelector('div > .Post' );

            let title = post.querySelector('h1').innerText;
            //this gets the url to the user page so no... can I just steal the url fom the input?
            // let link = post.querySelector('a').href;
            
            // Not sure we need these, but we probably want the date, maybe votes??
            // let comments = post.querySelector('i > .icon-comment span').innerText;
            // let votes = post.querySelector('[id*=upvote-button]   div').innerText;

            // let published = '';
            let user = post.querySelector('div > div > div > div > div > div > a').innerText;

            let description = '';
            try{
                description = post.querySelector('p').innerText;
            }catch(e){

            }

            postItems = {user: user, title: title/*, votes: votes, comments: comments*/, url: '', site: 'Reddit', text: description, page: ''};
    
            // posts.forEach((item) => {
            //     let title = item.querySelector('h3').innerText;
            //     let votes = item.querySelector('[id*=upvote-button]   div').innerText;
            //     let comments = item.querySelector('.icon-comment   span').innerText;
            //     let link = item.querySelector('a').href;
            //     let description = ''
            //     try{
            //     description = item.querySelector('p').innerText;
            //     }catch(e){
    
            //     }
    
            //     postItems.push({title: title, votes: votes, comments: comments, link: link, description: description});
    
            // });
    
    
            
            // var items = { 
            //     "posts": postItems
            // };
    
            // return items;
            return postItems;
            
        });
    
        rposts.url = url
        rposts.page = "r/" + components[4];
        // console.log(rposts);
        await browser.close();
        // console.log("End");
        return rposts;
    
    }).catch((error) => {
        console.error(error);
        browser.close();
        throw error;
    });

    



    // console.log(components)
    // [
    //     'https:',
    //     '',
    //     'www.reddit.com',
    //     'r',
    //     'redditdev',
    //     'comments',
    //     '7u94lj',
    //     'how_to_get_posts_using_api',
    //     ''
    //   ]
    // await https.get('https://www.reddit.com/api/v1/me',
    // /*auth=auth, data=data, headers=headers,*/ (resp) => {
    //     let data = '';

    //     // A chunk of data has been received.
    //     resp.on('data', (chunk) => {
    //         data += chunk;
    //         console.log(data)
    //     });

    //     // The whole response has been received. Print out the result.
    //     resp.on('end', () => {
    //         console.log(JSON.parse(data));
    //     });

    // }).on("error", (err) => {
    //     console.log("Error: " + err.message);
    // });

    // request.get('https://www.reddit.com/api/v1/me').auth(null, null, true, 'bearerToken');
    // .on('error', function(err) {
    //         console.error(err)
    // })

    // await request('https://www.reddit.com/api/v1/me', { json: true }, (err, res, body) => {
    //     if (err) { console.log("Error" + err); }
    //     else {
    //         console.log(body.url);
    //         console.log(body.explanation);
    //     }
    //     return components
    // })
    // console.log("huh")

    // const secretjson = JSON.parse(fs.readFileSync('./reddit/secret.json'));
    // , (err, data) => {
    //     if (err) {
    //         console.log("1")
    //         console.log(err)
    //         throw err
    //     };
    //     console.log("huh2")
    //     return JSON.parse(data);
    // });

    // const clientID = secretjson.oAuth
    // const clientSecret = secretjson.secret
    // console.log(clientID)
    // console.log(clientSecret)

    // const credentials = Buffer.from(`${clientID}:${clientSecret}`).toString("base64")
    // console.log(credentials)

    // const res = await fetch('https://www.reddit.com/api/v1/access_token', { 
    //     method: "POST",
    //     headers: {
    //         Authorization: `Basic ${credentials}`
    //     },
    //     body: form
    // })
    // console.log("here")
    // if (!res.ok) {
    //     console.log("2")
    //     console.log(await res.text())
    //     throw new Error(`${res.status}: ${await res.text()}`)
    // }
    // console.log("check")
    // console.log(res.json())
    // return components
});

module.exports = getRedditPost;