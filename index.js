// Import post scraping functions
var getTwitterPost = require("./twitter/post.js")
var getRedditPost = require("./reddit/reddit.js")

// Test server
const home = () => Promise.resolve("Server Up")

// Universal function to scrape from link
const getData = async (url) =>  {
    // Check if general link is valid, twitter
    if (url.includes("twitter.com")) {
        // Check if twitter link leads to a status post
        if (url.includes("/status/")) {
            // scrape twitter post
            return new Promise(async (resolve, reject) => {
                await getTwitterPost(url, false)
                .then((data) => {
                    resolve(data)
                }).catch((e)=> {
                    reject(e)
                })
            })
        } else {
            // Link is twitter, but not a status post
            return Promise.reject({error: "Twitter link is not a post"});
        }
    // check if general link is valid, reddit
    } else if (url.includes("reddit.com")) {
        // check if reddit link leads to a reddit post
        if (url.includes("/comments/")) {
            // scrape reddit post
            return new Promise(async (resolve, reject) => {
                await getRedditPost(url)
                .then((data) => {
                    resolve(data)
                }).catch((e)=> {
                    reject(e)
                })
            })
        } else {
            // Link is reddit, but not a post
            return Promise.reject({error: "Reddit link is not a post"});
        }
    } else {
        // Link does not lead to any supported site
        return Promise.reject({error: "Invalid link: We don't support this site yet"});
    }
}


// exports
module.exports = {
    home,
    getData
}