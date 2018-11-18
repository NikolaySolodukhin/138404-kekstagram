"use strict";

const express = require(`express`);
const path = require(`path`);
const postsStore = require(`./posts/store`);
const imageStore = require(`./images/store`);
const postRouter = require(`./posts/router/route`)(postsStore, imageStore);
const logger = require(`./logger`);
const {ERROR_HANDLER, NOT_FOUND_HANDLER} = require(`./error/handlers`);
const NotImplementedError = require(`./error/not-implemented-error`);

const app = express();
const {SERVER_PORT = 3000, SERVER_NAME = `localhost`} = process.env;

const staticPath = path.resolve(__dirname, `../static/`);

const CORS_HANDLER = (req, res, next) => {
  res.set({
    "Access-Control-Allow-Origin": `*`,
    "Access-Control-Allow-Headers": `Origin, X-Requested-With, Content-Type, Accept`
  });
  next();
};

const NOT_IMPLEMENTED = (req, res, next) => {
  const allowedMethods = [`GET`, `POST`];
  if (allowedMethods.includes(req.method)) {
    next();
  } else {
    throw new NotImplementedError(`Method not implemented`);
  }
};

app.use(CORS_HANDLER);
app.use(express.static(staticPath));
app.use(`/api/posts`, postRouter);
app.use(NOT_FOUND_HANDLER);
app.use(ERROR_HANDLER);
app.all(NOT_IMPLEMENTED);

const start = (port) => {
  app.listen((port = SERVER_PORT), SERVER_NAME, () =>
    logger.info(`Server start at http://${SERVER_NAME}:${port}`)
  );
};

module.exports = {
  start,
  app
};

if (require.main === module) {
  start();
}
