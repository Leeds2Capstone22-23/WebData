var getPost = require("./twitter/post.js")
var getRedditPost = require("./reddit/reddit.js")


const home = () => Promise.resolve("Link needed")

const getData = async (url) =>  {
    if (url.includes("twitter.com")) {
        if (url.includes("/status/")) {
            return new Promise(async (resolve, reject) => {
                await getPost(url, false)
                .then((data) => {
                    resolve(data)
                }).catch((e)=> {
                    reject(e)
                })
            })
        } else {
            return Promise.reject({error: "Twitter link is not a post"});
        }
    } else if (url.includes("reddit.com")) {
        if (url.includes("/comments/")) {
            return new Promise(async (resolve, reject) => {
                await getRedditPost(url)
                .then((data) => {
                    resolve(data)
                }).catch((e)=> {
                    reject(e)
                })
            })
        } else {
            return Promise.reject({error: "Reddit link is not a post"});
        }
    } else {
        return Promise.reject({error: "Invalid link: We don't support this site yet"});
    }
}



module.exports = {
    home,
    getData
}