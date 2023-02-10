// API call routes
const express = require("express");
const router = express.Router();
const index = require("./index")

// response handlers
const handleResponse = (res, data) => res.status(200).send(data);
// const handleJsonResponse = (res, data) => res.status(200).json(data);
const handleError = (res, err) => res.status(500).send(err);

// used to test if server is up
router.get('/', async (req, res) => {
    await index.home()
        .then(data => handleResponse(res, data))
        .catch(err => handleError(res, err));
});

router.get('/sites', async(req, res) => {
    await index.getSites()
        .then(data => handleResponse(res, data))
        .catch(err => handleError(res, err));
});

// universally extract from link
// NOTE: we have to use post since this is a rest API, and we are unable to pass a URL through a get request. 
// Since we need a URL to call puppeteer, the simplest solution was to use a POST request.
router.post('/extract', async (req, res) => {
    // don't ask me why this is here. I had some issues and now I'm afraid to remove it.
    // res.setHeader('Content-Type', 'application/json');

    // call index for extract, which is getData
    await index.getData(req.body.url)
        .then((data) => handleResponse(res, data))
        .catch((err) => {
            // console.log(err);
            handleError(res, err)
        });
});


// export router
module.exports = router;