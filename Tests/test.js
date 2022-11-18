const app = require("../server");
const supertest = require('supertest');

// afterAll(() => {
//     app.close()
// });


test("GET getData", async () => {
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

    console.log('/getData/"' + url + '"')
  
    await supertest(app).get('/getData/"' + url + '"')
      .expect(200)
      .then((response) => {
        // Check type and length
        // expect(Array.isArray(response.body)).toBeTruthy();
        // expect(response.body.length).toEqual(1);
  
        // Check data
        expect(response.body[0].url).toBe(post.url);
        expect(response.body[0].published).toBe(post.published);
        expect(response.body[0].error).toBe(post.error);
        expect(response.body[0].site).toBe(post.site);
        expect(response.body[0].text).toBe(post.text);
      });
  });