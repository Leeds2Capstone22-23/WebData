// Unit tests
const createServer = require("../server");
const supertest = require('supertest');

jest.setTimeout(50000)
let server = null;
let app = null;

beforeAll(() => {
  // start server
  app = createServer();
  server = app.listen(8888);
});

afterAll(() => {
  // close server
  server.close();
});

// test to ensure server connection
test("Test Server", async () => {
  await supertest(app).get('/').then((response) => {
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Server Up");
  })
})

describe("Twitter tests", () => {
  // Fully valid random twitter link, contains an image
  test("Extract Twitter Valid", async () => {
    const url = 'https://twitter.com/statmuse/status/1585456495541772288';
    const post = {
      link: [
        'https://pbs.twimg.com/media/FgCsR6yacAIW0CC?format=jpg&name=small'
      ],
      published: '2022-10-27T02:20:59.000Z',
      error: null,
      site: 'Twitter',
      text: 'Giannis now leads the NBA in scoring with 36.0 PPG on 67.7% shooting.\n' +
        '\n' +
        'Good night.',
      user: '@statmuse',
      url: url
    };
  
    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {
        // Check data
        expect(response.body.url).toBe(post.url);
        expect(response.body.published).toBe(post.published);
        expect(response.body.error).toBe(post.error);
        expect(response.body.site).toBe(post.site);
        expect(response.body.text).toBe(post.text);
        expect(response.body.user).toBe(post.user);
        expect(response.body.link).toEqual(post.link);
      });
  });
  
  // No body text, just a Gif (not much is gathered in this case)
  test("Extract Twitter no body text", async () => {
    const url = 'https://twitter.com/EmilyPa42700209/status/1623921342298083329';
    const post = {
      link: [],
      published: '2023-02-10T05:46:33.000Z',
      error: null,
      site: 'Twitter',
      text: '',
      user: '@EmilyPa42700209',
      url: url
    };
  
    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {
        // Check data
        expect(response.body.url).toBe(post.url);
        expect(response.body.published).toBe(post.published);
        expect(response.body.error).toBe(post.error);
        expect(response.body.site).toBe(post.site);
        expect(response.body.text).toBe(post.text);
        expect(response.body.user).toBe(post.user);
        expect(response.body.link).toEqual(post.link);
      });
  });

  // Post with a link and image
  test("Extract Twitter with links", async () => {
    const url = 'https://twitter.com/boulderpolice/status/1623088935374299136';
    const post = {
      link: [
        'https://pbs.twimg.com/media/FoYIDeYaAAANkhs?format=jpg&name=small'
      ],
      published: '2023-02-07T22:38:52.000Z',
      error: null,
      site: 'Twitter',
      text: 'Want to know more about what your Boulder Police Department does in our community? Here is some data from the past week. Read more detailed crime stats on our crime dashboard at https://bouldercolorado.gov/crime-dashboard #boulder #BoulderColorado',
      user: '@boulderpolice',
      url: url
    }
  
    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {
        // Check data
        expect(response.body.url).toBe(post.url);
        expect(response.body.published).toBe(post.published);
        expect(response.body.error).toBe(post.error);
        expect(response.body.site).toBe(post.site);
        expect(response.body.text).toBe(post.text);
        expect(response.body.user).toBe(post.user);
        expect(response.body.link).toEqual(post.link);
      });
  });

  // post with 2 images
  test("Twitter post with multiple images", async () => {
    const url = 'https://twitter.com/ech0bug/status/1623911758623805440'
    const post = {
        link: [
          'https://pbs.twimg.com/media/FolLIsEaMAAYIBx?format=jpg&name=360x360',
          'https://pbs.twimg.com/media/FolLIsFagAEVFyt?format=jpg&name=360x360'
        ],
        published: '2023-02-10T05:08:28.000Z',
        error: null,
        site: 'Twitter',
        text: 'thank you pierce the veil and paramore for starting off 2023 right',
        user: '@ech0bug',
        url: url
      };
  
    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {
        // Check data
        expect(response.body.url).toBe(post.url);
        expect(response.body.published).toBe(post.published);
        expect(response.body.error).toBe(post.error);
        expect(response.body.site).toBe(post.site);
        expect(response.body.text).toBe(post.text);
        expect(response.body.user).toBe(post.user);
        expect(response.body.link).toEqual(post.link);
      });
  });

  describe("Error Checks", () => {
    // Link contains "twitter.com" but not "/status/"
    test("Invalid Twitter link", async () => {
      url = "https://twitter.com/";
      await supertest(app).post("/extract").send({ url: url })
        .expect(500)
        .then((error) => {
          expect(error.body.error).toBe("Twitter link is not a post");
      });
    });
  
    // Link contains "twitter.com" and "/status/" but leads to an invalid post (such as a deleted post)
    test("Invalid Twitter link past initial url check", async () => {
      url = "https://twitter.com/status/hebfklawebflaiwbefklawbefthisshouldntwork/";
      await supertest(app).post("/extract").send({ url: url })
        .expect(500)
        .then((error) => {
          expect(error.body.error).toBe("Twitter link invalid");
      });
    });
  })
})


describe("Reddit extraction tests", () => {
  // Fully valid random reddit post
  test("Extract Reddit Valid", async () => {
    const url = 'https://www.reddit.com/r/redditdev/comments/7u94lj/how_to_get_posts_using_api/';
    const post = {
      user: 'u/alex-kozack',
      title: 'How to get posts using api?',
      url: url,
      site: 'Reddit',
      text: 'I want to implement a node server, which on demand will receive and store the last posts from the subrredit. How to implement? How to get authorized? How to use api?',
      page: 'r/redditdev',
      link: []
    }

    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {

        // Check data
        expect(response.body.url).toBe(post.url);
        expect(response.body.title).toBe(post.title);
        expect(response.body.user).toBe(post.user);
        expect(response.body.site).toBe(post.site);
        expect(response.body.text).toBe(post.text);
        expect(response.body.page).toBe(post.page);
        expect(response.body.link).toEqual(post.link);
      });
  });

  // Reddit post with no body, only title
  test("Extract Reddit, no body", async() => {
    const url = 'https://www.reddit.com/r/AnimalsBeingBros/comments/10yan5f/this_kitty_has_adopted_a_juvenile_possum_and_lets/';
    const post = {
      user: 'u/purple-circle',
      title: 'This kitty has adopted a juvenile possum and lets him ride around on her as its mother would',
      url: url,
      site: 'Reddit',
      text: '',
      page: 'r/AnimalsBeingBros',
      link: []
    }

    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {

        // Check data
        expect(response.body.url).toBe(post.url);
        expect(response.body.title).toBe(post.title);
        expect(response.body.user).toBe(post.user);
        expect(response.body.site).toBe(post.site);
        expect(response.body.text).toBe(post.text);
        expect(response.body.page).toBe(post.page);
        expect(response.body.link).toEqual(post.link);
      });
  })

  // Reddit post with image
  test("Extract reddit with image", async () => {
    const url = 'https://www.reddit.com/r/mildlyinfuriating/comments/10xznr6/my_so_throws_her_daily_contacts_behind_the/'
    const post = {
      user: 'u/FireRotor',
      title: 'My SO throws her daily contacts behind the headboard of our bed.',
      site: 'Reddit',
      text: '',
      link: [ 'https://i.redd.it/dd7x7o9li8ha1.jpg' ],
      url: url,
      page: 'r/mildlyinfuriating'
    };

    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {

        // Check data
        expect(response.body.url).toBe(post.url);
        expect(response.body.title).toBe(post.title);
        expect(response.body.user).toBe(post.user);
        expect(response.body.site).toBe(post.site);
        expect(response.body.text).toBe(post.text);
        expect(response.body.page).toBe(post.page);
        expect(response.body.link).toEqual(post.link);
      });
  });

  // Reddit post with an external link (these are not imbedded in the text)
  test("Reddit with external link", async () => {
    const url = 'https://www.reddit.com/r/worldnews/comments/10y8gm7/russia_illegally_occupying_islands_off_hokkaido/'
    const post = {
      user: 'u/progress18',
      title: 'Russia illegally occupying islands off Hokkaido: Japan',
      site: 'Reddit',
      text: '',
      link: [ 'https://www.taiwannews.com.tw/en/news/4804940' ],
      url: url,
      page: 'r/worldnews'
    }

    await supertest(app).post("/extract").send({ url: url })
      .expect(200)
      .then((response) => {
        // Check data
        expect(response.body.url).toBe(post.url);
        expect(response.body.title).toBe(post.title);
        expect(response.body.user).toBe(post.user);
        expect(response.body.site).toBe(post.site);
        expect(response.body.text).toBe(post.text);
        expect(response.body.page).toBe(post.page);
        expect(response.body.link).toEqual(post.link);
      });
  });

  describe("Error Checks", () => {
    // Contains "reddit.com" but not "/comments/"
    test("Fully Invalid Reddit link", async () => {
      url = "https://www.reddit.com/";
      await supertest(app).post("/extract").send({ url: url })
        .expect(500)
        .then((error) => {
          expect(error.body.error).toBe("Reddit link is not a post");
      });
    });
  
    // Contains "reddit.com" and "/comments/" but leads to an invalid post (such as a deleted one)
    test("Invalid Reddit link past initial url checks", async () => {
      url = "https://www.reddit.com/comments/hebfklawebflaiwbefklawbefthisshouldntwork/";
      await supertest(app).post("/extract").send({ url: url })
        .expect(500)
        .then((error) => {
          expect(error.body.error).toBe("Reddit link invalid");
      });
    });

  });
});

describe("Extract invalid link", () => {
  // Completely unsuported site
  test("Unsupported site", async () => {
    url = "https://www.google.com";
    await supertest(app).post("/extract").send({ url: url })
      .expect(500)
      .then((error) => {
        expect(error.body.error).toBe("Invalid link: We don't support this site yet");
    });
  });
});