# WebData
For a separate API related to web scraping and other data access methods for sites.

Not currently functional, just an outline

# Getting started

## Build

To build the dependencies run:

``` npm install ```

## Run

To run the application without docker:

``` node index.js ```

To build with docker:

*Not yet implemented*

# About

Each individual directory contains an API for a given site. These APIs are created independent to the site, and run either using web scraping through Puppeteer or through the site's provided API. The individual APIs are set up to be accesses through one main API connection. The API is intended to be accessed externally to deliver requested data from a specified site.

## Included Sites

*Details on individual site APIs once completed*

# TODOs
- Implement docker to be consistent with the rest of the project
- Check if Twitter API is a more viable option for getting data, specifically if we qualify for academic reseach access level, and if not if the elevated level would be viable
- Debug and complete outline for basic twitter webscraping with puppeteer
- Setup twitter data as basic API access
- Look into the reddit webscraping and API
- Design what we want the overall API to look like