var app = require("./server.js")
var getPost = require("./twitter/post.js")

app.get('/getData/${url}', async function (req, res) {
    console.log(req.body.url)
    try {
        let result = await getPost(req.body.url, false);
        return res.status(200).json(result);
    } catch(e) {
        console.log(e);
        return res.status(400).json(e)
    }
    // console.log(result)
    // return result;
})