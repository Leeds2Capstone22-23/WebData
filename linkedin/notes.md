# LinkedIn Notes

## Scraping

LinkedIn is blocked by a fairly strict Authorization wall. Essentially you need an account to access anything, violating user agreement. For reference see [this post](https://stackoverflow.com/questions/63660406/public-linkedin-page-requires-authentication-in-puppeteer-but-it-doesnt-when-ma).

## API

[LinkedIn Developer](https://developer.linkedin.com/)

[LinkedIn API Documentation](https://learn.microsoft.com/en-us/linkedin/)

The LinkedIn API seems to work as a series of products with limited scopes. So far, I have been unable to find a product that fits our needs. The [LinkedIn Product Catalog](https://developer.linkedin.com/product-catalog) provides a brief overview into the available products. The closest API product I feel may fit is the [Sales Display](https://learn.microsoft.com/en-us/linkedin/sales/), as it is the main one for accessing site data. Many of the available products are for an authenticated account to manage adding fields and postings to the account, which do not fit our needs.

Overall, from what I can tell, the API for LinkedIn is fairly limited on what is allowed, and limiting on what we will be able to do with it.

In general, unless we overcome the authorization wall, LinkedIn may not be a valid site for us to extract data from in order to work with.