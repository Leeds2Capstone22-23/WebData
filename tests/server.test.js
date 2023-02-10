const createServer = require("../server");
const supertest = require('supertest');

jest.setTimeout(50000)
let server = null;
let app = null;

beforeAll(() => {

  app = createServer();
  server = app.listen(8888);
});

afterAll(() => {
  server.close();
});

test("Test Server", async () => {
  await supertest(app).get('/').then((res) => {
    expect(res.statusCode).toBe(200)
  })
})

describe("Twitter tests", () => {
  test("Extract Twitter Valid", async () => {
    const url = 'https://twitter.com/statmuse/status/1585456495541772288';
    const post = {
      media: [
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
        expect(response.body.media).toEqual(post.media);
      });
  });
  
  test("Extract Twitter no text", async () => {
    const url = 'https://twitter.com/EmilyPa42700209/status/1623921342298083329';
    const post = {
      media: [],
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
        expect(response.body.media).toEqual(post.media);
      });
  });

  test("Extract Twitter with links", async () => {
    const url = 'https://twitter.com/boulderpolice/status/1623088935374299136';
    const post = {
      media: [
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
        expect(response.body.media).toEqual(post.media);
      });
  });

  test("Extract multiple twitter posts", async () => {
    const urls = ['https://twitter.com/ech0bug/status/1623911758623805440',
                  'https://twitter.com/StonerPhillyFan/status/1623953049839362048',
                  'https://twitter.com/statmuse/status/1585456495541772288'
                  ];
    const posts = [
      {
        media: [
          'https://pbs.twimg.com/media/FolLIsEaMAAYIBx?format=jpg&name=360x360',
          'https://pbs.twimg.com/media/FolLIsFagAEVFyt?format=jpg&name=360x360'
        ],
        published: '2023-02-10T05:08:28.000Z',
        error: null,
        site: 'Twitter',
        text: 'thank you pierce the veil and paramore for starting off 2023 right',
        user: '@ech0bug',
        url: 'https://twitter.com/ech0bug/status/1623911758623805440'
      },
      {
        media: [],
        published: '2023-02-10T07:52:33.000Z',
        error: null,
        site: 'Twitter',
        text: 'The only #NFLHonors I care about is the Eagles winning Super Bowl 57',
        user: '@StonerPhillyFan',
        url: 'https://twitter.com/StonerPhillyFan/status/1623953049839362048'
      },
      {
        media: [
          'https://pbs.twimg.com/media/FgCsR6yacAIW0CC?format=jpg&name=small'
        ],
        published: '2022-10-27T02:20:59.000Z',
        error: null,
        site: 'Twitter',
        text: 'Giannis now leads the NBA in scoring with 36.0 PPG on 67.7% shooting.\n' +
          '\n' +
          'Good night.',
        user: '@statmuse',
        url: 'https://twitter.com/statmuse/status/1585456495541772288'
      }
    ];
  
    for (let i=0; i < urls.length; i++) {
    await supertest(app).post("/extract").send({ url: urls[i] })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(posts[i])
      });
    }
  });

  describe("Error Checks", () => {
    test("Invalid Twitter link", async () => {
      url = "https://twitter.com/";
      await supertest(app).post("/extract").send({ url: url })
        .expect(500)
        .then((error) => {
          expect(error.body.error).toBe("Twitter link is not a post");
      });
    });
  
    test("Invalid Twitter link past initial", async () => {
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
  test("Extract Reddit Valid", async () => {
    const url = 'https://www.reddit.com/r/redditdev/comments/7u94lj/how_to_get_posts_using_api/';
    const post = {
      user: 'u/alex-kozack',
      title: 'How to get posts using api?',
      url: url,
      site: 'Reddit',
      text: 'I want to implement a node server, which on demand will receive and store the last posts from the subrredit. How to implement? How to get authorized? How to use api?',
      page: 'r/redditdev',
      links: []
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
        expect(response.body.links).toEqual(post.links);
      });
  });

  test("Extract Reddit, no body", async() => {
    const url = 'https://www.reddit.com/r/AnimalsBeingBros/comments/10yan5f/this_kitty_has_adopted_a_juvenile_possum_and_lets/';
    const post = {
      user: 'u/purple-circle',
      title: 'This kitty has adopted a juvenile possum and lets him ride around on her as its mother would',
      url: url,
      site: 'Reddit',
      text: '',
      page: 'r/AnimalsBeingBros',
      links: []
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
        expect(response.body.links).toEqual(post.links);
      });
  })

  test("Extract reddit with image", async () => {
    const url = 'https://www.reddit.com/r/mildlyinfuriating/comments/10xznr6/my_so_throws_her_daily_contacts_behind_the/'
    const post = {
      user: 'u/FireRotor',
      title: 'My SO throws her daily contacts behind the headboard of our bed.',
      site: 'Reddit',
      text: '',
      links: [ 'https://i.redd.it/dd7x7o9li8ha1.jpg' ],
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
        expect(response.body.links).toEqual(post.links);
      });
  });

  test("Reddit with external link", async () => {
    const url = 'https://www.reddit.com/r/worldnews/comments/10y8gm7/russia_illegally_occupying_islands_off_hokkaido/'
    const post = {
      user: 'u/progress18',
      title: 'Russia illegally occupying islands off Hokkaido: Japan',
      site: 'Reddit',
      text: '',
      links: [ 'https://www.taiwannews.com.tw/en/news/4804940' ],
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
        expect(response.body.links).toEqual(post.links);
      });
  });

  describe("Error Checks", () => {
    test("Fully Invalid Reddit link", async () => {
      url = "https://www.reddit.com/";
      await supertest(app).post("/extract").send({ url: url })
        .expect(500)
        .then((error) => {
          expect(error.body.error).toBe("Reddit link is not a post");
      });
    });
  
    test("Invalid Reddit link past initial", async () => {
      url = "https://www.reddit.com/comments/hebfklawebflaiwbefklawbefthisshouldntwork/";
      await supertest(app).post("/extract").send({ url: url })
        .expect(500)
        .then((error) => {
          expect(error.body.error).toBe("Reddit link invalid");
      });
    });

  });
});

describe("Extract invalid links", () => {
  test("Unsupported site", async () => {
    url = "https://www.google.com";
    await supertest(app).post("/extract").send({ url: url })
      .expect(500)
      .then((error) => {
        expect(error.body.error).toBe("Invalid link: We don't support this site yet");
    });
  });
});