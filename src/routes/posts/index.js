"use strict";

const express = require(`express`);
const {generateData} = require(`../../generate`);
// eslint-disable-next-line new-cap
const postsRouter = express.Router();
const multer = require(`multer`);
const jsonParse = express.json();
const upload = multer();
const NotFoundError = require(`../../error/not-found-error`);
const validate = require(`./validate`);
const ValidateError = require(`../../error/validate`);

const SKIP_DEFAULT = 0;
const LIMIT_DEFAULT = 50;
const NUMBER_POSTS_ELEMENTS = 17;

const posts = generateData(NUMBER_POSTS_ELEMENTS);
postsRouter.get(`/`, (req, res) => {
  const skip = parseInt(req.query.skip, 10) || SKIP_DEFAULT;
  const limit = parseInt(req.query.limit, 10) || LIMIT_DEFAULT;
  const data = posts.slice(skip, limit + skip);
  res.send(data);
});

postsRouter.get(`/:date`, (req, res) => {
  const date = parseInt(req.params.date, 10);
  const post = posts.find((item) => {
    if (item.date === date) {
      return item;
    }
    return false;
  });

  if (!post) {
    throw new NotFoundError(`Не найден пост с датой`);
  }

  res.send(post);
});

postsRouter.post(``, jsonParse, upload.single(`filename`), (req, res) => {
  const {body, file} = req;

  if (file) {
    const {mimetype, originalname} = file;
    body.filename = {
      mimetype,
      originalname
    };
  }

  res.send(validate(body));
});

postsRouter.use((err, req, res, _next) => {
  if (err instanceof ValidateError) {
    res.status(err.code).json(err.errors);
  }
  _next(err);
});

module.exports = postsRouter;
