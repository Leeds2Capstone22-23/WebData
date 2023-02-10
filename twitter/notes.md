# Twitter Notes

Twitter became problematic right off the bat. The API will not work as Elon decided to destroy it. Scraping Twitter is also more difficult then some other applications. We have been able to get what we can to work.

## Scraping

Working with Puppeteer and twitter has so far been the most viable option, however we have limited spending excess time on this since there are many changes being made to twitter at the moment.

The basic functioning of the program began from this [example](https://javascript.plainenglish.io/how-to-scrape-twitter-data-with-depth-first-recursion-afbd437472b5) which puts the replies of a tweet into a JSON format, including the text body, to function as an API. Working on modifying this to be able to get original tweets from searching a specific keyword, or from looking at a specific public profile. The main difference that twitter currently has, is this example uses the `puppeteer-extra` library. This was due to it's use in the original example. I chose not to change this as the ability to access elements in twitter was much more difficult then I expected.

From that starting point, I isolated the relevant code and edited it to fit what we needed to pull. Currently there are two files. `twitter/replies.js` has not been edited from the initial example. This is meant to be used a recursive comment crawler to collect replies in a post. We are not currently calling this for the API, but it may become useful in the future.

`twitter/post.js` is the main file we are currently using. This file collects the relevent post data from a twitter post url, and returns it through the API. Currently this is functional despite all the changes to twitter. I will work to allow it to function as long as possible as twitter changes. Twitter's main issues for webscraping comes from it's lack of class name usage.

Also, as with most any site, we are unable to extract videos using Javascript. This is simply due to how Javascript queries, and how videos are handled. I may attempt this in the future, but for now we do not have any good resources to share videos.

The Twitter data being scraped is:
- **site**: Twitter
- **url**: The provided url
- **user**: The user who posted
- **published**: The date/time published in a UTC ("Zulu") string
- **text**: The body text of the post, sometimes empty
- **link**: Any external links for images, general links are embeded in the text
- **error**: An error code used in the initial resource that remained null for all my tests. We may choose to remove this


## API

[Twitter API](https://developer.twitter.com/en/docs/twitter-api)

Twitter API is a viable solution that can allow up to 10 million tweets per month depending on access level. Currently, we are limited to 500k, however we should be able to get this to 2 million with a free elevated account. It is possible this project may qualify for the academic research access level, at which point we would gain the maximum access that is currently available. 

This may be worth looking into with more depth if the Puppeteer scraping runs into too many issues. This would provide a more streamline and likely quicker way to pull larger quantities of posts.

### Update

After Elon Musk bought twitter, he seemed to have nuked the API. The webscraping script still works for now so we have decided to abandon the API altoegther. There are still many changes being made to twitter, but we will keep what ability we do have. The main way to prevent breaking will likely involve coding with excessive expectation of errors.