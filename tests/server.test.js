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


test("Extract Twitter Valid", async () => {
  const url = 'https://twitter.com/statmuse/status/1585456495541772288';
  const post = {
    url: '/statmuse/status/1585456495541772288',
    published: '2022-10-27T02:20:59.000Z',
    error: null,
    site: 'Twitter',
    text: 'Giannis now leads the NBA in scoring with 36.0 PPG on 67.7% shooting.\n' +
      '\n' +
      'Good night.'
  };

  // console.log('/getData/"' + url + '"')

  await supertest(app).post("/extract").send({ url: url })
    .expect(200)
    .then((response) => {

      // Check data
      expect(response.body.url).toBe(post.url);
      expect(response.body.published).toBe(post.published);
      expect(response.body.error).toBe(post.error);
      expect(response.body.site).toBe(post.site);
      expect(response.body.text).toBe(post.text);
    });
});


test("Extract Reddit Valid", async () => {
  const url = 'https://www.reddit.com/r/redditdev/comments/7u94lj/how_to_get_posts_using_api/';
  const post = {
    user: 'u/alex-kozack',
    title: 'How to get posts using api?',
    url: 'https://www.reddit.com/r/redditdev/comments/7u94lj/how_to_get_posts_using_api/',
    site: 'Reddit',
    text: 'I want to implement a node server, which on demand will receive and store the last posts from the subrredit. How to implement? How to get authorized? How to use api?',
    page: 'r/redditdev'
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
    });
});

// test("Extract invalid links", async () => {
  test("Unsupported site", async () => {
    url = "https://www.google.com";
    await supertest(app).post("/extract").send({ url: url })
      .expect(500)
      .then((error) => {
        expect(error.body.error).toBe("Invalid link: We don't support this site yet");
    });
  });

  test("Invalid Twitter link", async () => {
    url = "https://www.twitter.com/";
    await supertest(app).post("/extract").send({ url: url })
      .expect(500)
      .then((error) => {
        expect(error.body.error).toBe("Twitter link is not a post");
    });
  });

  test("Invalid Reddit link", async () => {
    url = "https://www.reddit.com/";
    await supertest(app).post("/extract").send({ url: url })
      .expect(500)
      .then((error) => {
        expect(error.body.error).toBe("Reddit link is not a post");
    });
  });
// });