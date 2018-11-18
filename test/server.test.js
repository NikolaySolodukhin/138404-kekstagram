"use strict";

const supertest = require(`supertest`);
const assert = require(`assert`);
const express = require(`express`);

const postsStoreMock = require(`./mock/posts-store-mock`);
const imageStoreMock = require(`./mock/image-store-mock`);
const postsRouter = require(`../src/posts/router/route`)(
    postsStoreMock,
    imageStoreMock
);

const NUMBER_POSTS_ELEMENTS = 60;

const app = express();
app.use(`/api/posts`, postsRouter);

describe(`GET`, () => {
  it(`get all posts`, async () => {
    const response = await supertest(app)
      .get(`/api/posts`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);
    const posts = response.body;
    assert.strictEqual(posts.total, NUMBER_POSTS_ELEMENTS);
    assert.strictEqual(posts.data.length, 50);
  });

  it(`get all posts?skip=2&limit=52`, async () => {
    const response = await supertest(app)
      .get(`/api/posts?skip=2&limit=52`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);
    const posts = response.body;
    assert.strictEqual(posts.total, NUMBER_POSTS_ELEMENTS);
    assert.strictEqual(posts.data.length, 52);
  });


  it(`send incorrect skip parameter`, async () => {
    return await supertest(app)
      .get(`/api/posts?skip=regbbrgbjr&limit=52`)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /html/)
      .expect(`Неверное значение параметра "skip" или "limit"`);
  });

  it(`send incorrect limit parameter`, async () => {
    return await supertest(app)
      .get(`/api/posts?skip=2&limit=8382rewnbjgejgfnjwefnjenwfje83`)
      .set(`Accept`, `application/json`)
      .expect(400)
      .expect(`Content-Type`, /html/)
      .expect(`Неверное значение параметра "skip" или "limit"`);
  });

  it(`get all posts with / at the end`, async () => {
    const response = await supertest(app)
      .get(`/api/posts/`)
      .set(`Accept`, `application/json`)
      .expect(200)
      .expect(`Content-Type`, /json/);
    const posts = response.body;
    assert.strictEqual(posts.total, NUMBER_POSTS_ELEMENTS);
    assert.strictEqual(posts.data.length, 50);
  });

  // describe(`GET /api/posts/:date/image`, () => {
  //   it(`get post with date 1 March 2049`, async () => {
  //     const date = new Date(2029, 0, 1).valueOf();
  //     const response = await supertest(app)
  //       .get(`/api/posts/${date}/image`)
  //       .set(`Accept`, `application/json`)
  //       .expect(400)
  //       .expect(`Content-Type`, /json/);
  //     const post = response.body;
  //     assert.strictEqual(post.date, date);
  //   });
  // });

  describe(`GET /api/posts/:date`, () => {
    it(`get post with date 1 March 2049`, async () => {
      const date = new Date(2049, 0, 1).valueOf();
      const response = await supertest(app)
        .get(`/api/posts/${date}`)
        .set(`Accept`, `application/json`)
        .expect(200)
        .expect(`Content-Type`, /json/);
      const post = response.body;
      assert.strictEqual(post.date, date);
    });

    it(`get post with unknown date`, async () => {
      const date = new Date(2029, 2, 1).valueOf();
      return await supertest(app)
        .get(`/api/posts/${date}/`)
        .set(`Accept`, `application/json`)
        .expect(404)
        .expect(`Content-Type`, /json/)
        .expect(JSON.stringify(`Не найден пост с датой`));
    });
  });
});

describe(`POST`, () => {
  describe(``, () => {
    it(`POST /api/posts/`, async () => {
      await supertest(app)
        .post(`/api/posts`)
        .field(`scale`, 77)
        .field(`effect`, `chrome`)
        .attach(`filename`, `test/fixtures/keks.png`)
        .set(`Accept`, `image/png`)
        .set(`Content-Type`, `multipart/form-data`)
        .expect(200)
        .expect(`Content-Type`, /image/);
    });

    it(`POST /api/posts/ without require param`, async () => {
      const response = await supertest(app)
        .post(`/api/posts`)
        .field(`scale`, `200`)
        .field(`effect`, `marvin`)
        .attach(`filename`, `test/fixtures/keks.png`)
        .set(`Accept`, `application/json`)
        .set(`Content-Type`, `multipart/form-data`)
        .expect(400)
        .expect(`Content-Type`, /json/);
      const post = response.body;
      assert.deepEqual(post[0].fieldName, `scale`);
    });
  });
});
