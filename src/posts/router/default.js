'use strict';

const {
  Duplex
} = require(`stream`);
const multer = require(`multer`);
const express = require(`express`);
// eslint-disable-next-line new-cap

const jsonParse = express.json();
const upload = multer();

const validate = require(`../validate`);
const IllegalArgumentError = require(`../../error/illegal-argument-error`);
const htmlTemplate = require(`../template`);
const asyncMiddleware = require(`./async-middleware`);

const SKIP_DEFAULT = 0;
const LIMIT_DEFAULT = 50;

const toStream = (buffer) => {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const format = (data) => {
  const {
    date,
    description,
    effect,
    hashtags,
    likes,
    scale
  } = data;

  const result = {
    url: `/api/posts/${date}/image`,
    description,
    effect,
    hashtags,
    likes,
    scale,
    date
  };

  return result;
};

const toPage = async (
  cursor,
  skip = SKIP_DEFAULT,
  limit = LIMIT_DEFAULT,
  html
) => {
  const packet = await cursor
    .skip(skip)
    .limit(limit)
    .toArray();

  const result = {
    data: packet.map(format),
    skip,
    limit,
    total: await cursor.count()
  };

  return html ? htmlTemplate(result) : result;
};

module.exports = (router) => {
  router.get(
      ``,
      asyncMiddleware(async (req, res) => {
        const skip = parseInt(checkIsNaN(req.query.skip) || SKIP_DEFAULT, 10);
        const limit = parseInt(checkIsNaN(req.query.limit) || LIMIT_DEFAULT, 10);
        const data = await router.postsStore.allPosts;
        const htmlAccept = req.get(`Accept`).includes(`text/html`);
        res.send(await toPage(data, skip, limit, htmlAccept));
      })
  );

  const checkIsNaN = (parameter) => {
    if (parameter === undefined || parameter === null) {
      return false;
    }

    if (isNaN(parameter)) {
      throw new IllegalArgumentError(
          `Неверное значение параметра "skip" или "limit"`
      );
    }

    return parameter;
  };

  router.post(
      ``,
      jsonParse,
      upload.single(`filename`),
      asyncMiddleware(async (req, res, _next) => {
        const {
          body,
          file
        } = req;

        if (file) {
          const {
            mimetype,
            originalname
          } = file;
          body.filename = {
            mimetype,
            name: originalname
          };
        }

        const validated = validate(body);
        validated.date = Date.now();
        const result = await router.postsStore.save(validated);
        const insertedId = result.insertedId;

        if (file) {
          await router.imageStore.save(insertedId, toStream(file.buffer));
          res.type(file.mimetype);
          res.send(file.buffer);
          return;
        }

        res.send(validated);
      })
  );
};
