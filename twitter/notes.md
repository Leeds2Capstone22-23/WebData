# Twitter Notes

## Scraping

Working with Puppeteer and twitter is currently in progress. Will be worked on in a branch, then updated when functional.

Currently have a basic functioning program from this [example](https://javascript.plainenglish.io/how-to-scrape-twitter-data-with-depth-first-recursion-afbd437472b5) which puts the replies of a tweet into a JSON format, including the text body, to function as an API. Working on modifying this to be able to get original tweets from searching a specific keyword, or from looking at a specific public profile.

To run this example program:

``` node twitter\twitter.js ```

## API

[Twitter API](https://developer.twitter.com/en/docs/twitter-api)

Twitter API is a viable solution that can allow up to 10 million tweets per month depending on access level. Currently, we are limited to 500k, however we should be able to get this to 2 million with a free elevated account. It is possible this project may qualify for the academic research access level, at which point we would gain the maximum access that is currently available. 

This may be worth looking into with more depth if the Puppeteer scraping runs into too many issues. This would provide a more streamline and likely quicker way to pull larger quantities of posts.