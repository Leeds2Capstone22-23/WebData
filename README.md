# WebData
For a separate API related to web scraping and other data access methods for sites.

# Getting started

## Build

To build the dependencies run:

` npm install `

## Run

To run the application without docker:

` npm start `

To build with docker:

*Not yet implemented*

## Test

To test the application run:

` npm test `

# About

Each individual directory contains an API for a given site. These APIs are created independent to the site, and run either using web scraping through Puppeteer or through the site's provided API. The individual APIs are set up to be accesses through one main API connection. The API is intended to be accessed externally to deliver requested data from a specified site.

The current limitations of this API are that many sites are not implemented. In addition, we cannot collect videos from a post though the current methods unless they are only included through a link.

## Included Sites

### Twitter

Twitter uses puppeteer-extra and an edited existing implementation to scrape from a Twitter status post URL. (See twitter/notes.md for more information). 

The collected data from Twitter is:
- **site**: Twitter
- **url**: The provided url
- **user**: The user who posted
- **published**: The date/time published in a UTC ("Zulu") string
- **text**: The body text of the post, sometimes empty
- **link**: Any external links for images, general links are embeded in the text
- **error**: An error code used in the initial resource that remained null for all my tests. We may choose to remove this

The current limitations of Twitter are the ongoing changes. This limits what may work in the future as the change of management continues to rapidly change the site.

### Reddit

Reddit uses puppeteer and a heavily modified basic implementation a reddit webscraping script. (See reddit/notes.md for more information). This script collects data from a link for a reddit post.

The collected data from Reddit is:
- **site**: Reddit
- **url**: The provided url
- **user**: The user who posted
- **page**: The subreddit
- **published**: The date/time published with respect to when the data was scraped
- **title**: The post title (never empty)
- **text**: The body text of the post, sometimes empty
- **link**: Any external links such as to other sites or images

The main limitation of reddit is that we cannot pull an accurate date or time a post was made. This is simply missing for consistency.

# API 

The API Currently has 3 calls that can be made.

## Get " \ "

This call is a home call that returns "Server Up" if the server is running. This is to check the server status.

## Get " \sites "

This call returns an array of the sites that we currently have support for. Right now this string needs to be updated manually as we get access to more sites.

## Post " \extract "

This method takes one argument: { `url` }. This is the link that we are using to scrape. From there, it makes the necessary calls to find what sites the url links to, and scrape accordingly.

If a call is made with a url to a site not yet set up, then we return the error "Invalid link: We don't support this site yet". Otherwise, there are some error messages specific to each site, such as if the site name is valid but does not lead to a specific post.

After scraping, the data is being returned in a JSON object based on the site that was scraped. That data is outlined in the specific site information above.

The varying information between sites is compacted so all sites return the same information, given a valid URL. That data is:
- **site**: The name of the site the url goes to.
- **url**: The same url as the one provided.
- **content**: The varying site information compacted and formated to a single body, made to be stored in the same way as the documents.

It will then be up to the user of the Tag'n'Bag application to define the name of the document to represent the post.


# TODOs
- Reformat to complete desired API
- Add call to pull list of currently valid sites.
- Implement docker to be consistent with the rest of the project
- Clean up twitter some more
- Create consistency between files
- Add Medium.com scraping
- Revisit possibility of linkedin
- Look into other good sites to have