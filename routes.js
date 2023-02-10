const express = require("express");
const router = express.Router();
const index = require("./index")

const handleResponse = (res, data) => res.status(200).send(data);
const handleJsonResponse = (res, data) => res.status(200).json(data);
const handleError = (res, err) => res.status(500).send(err);

// Home page route.
router.get('/', async (req, res) => {
    await index.home()
        .then(data => handleResponse(res, data))
        .catch(err => handleError(res, err));
});

// getData from link
router.post('/extract', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    await index.getData(req.body.url)
        .then((data) => handleResponse(res, data))
        .catch((err) => {
            console.log(err);
            handleError(res, err)
        });
});

module.exports = router;