# Reddit Notes

Reddit had less overall issues than attempting Twitter. The main issues were wasting time on the API, and the issues with how reddit handles dates. I ended up using puppeteer to scrape the data.

## Scraping

Webscraping Reddit with puppeteer was much simpler than Twitter. I ended up needing to use less resources and the reddit elements were constructed much better. This allowed me to quickly get the data from reddit.

The most useful resource I used was a basic guide for webscraping Reddit with puppeteer called [Web scraping Reddit using Node JS and Puppeteer](https://proxiesapi.com/blog/web-scraping-reddit-using-node-js-and-puppeteer.html.php). This guide was a useful starting point, though somewhat out of date.

The downside comes from the way dates are displayed and stored on reddit. I was unable to find a way to extract the exact publishing date, only a time/date relevent to when the data is scraped. This has limited use in our context. While I am scraping it, we are not likely to use this.

Also, as with most any site, we are unable to extract videos using Javascript. This is simply due to how Javascript queries, and how videos are handled. I may attempt this in the future, but for now we do not have any good resources to share videos.

Data being scraped from Reddit currently:
- **site**: Reddit
- **url**: The provided url
- **user**: The user who posted
- **page**: The subreddit
- **published**: The date/time published with respect to when the data was scraped
- **title**: The post title (never empty)
- **text**: The body text of the post, sometimes empty
- **link**: Any external links such as to other sites or images

## API

[Reddit API](https://www.reddit.com/dev/api/)

This API seemed like a viable option at first, however upon connecting I found that the descriptions of some of the calls did not match what I thought they did. I have decided to abandon the API, as it was consuming too much time to be fruitful.

The reddit API seems to be mainly geared towards building bots and automods. 