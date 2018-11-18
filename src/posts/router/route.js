'use strict';

const express = require(`express`);
// eslint-disable-next-line new-cap
const router = express.Router();

const {ERROR_HANDLER, NOT_FOUND_HANDLER} = require(`../../error/handlers`);
const defaultRoute = require(`./default`);
const dateRoute = require(`./date`);
const imageRoute = require(`./image`);

defaultRoute(router);
dateRoute(router);
imageRoute(router);

router.use(ERROR_HANDLER);
router.use(NOT_FOUND_HANDLER);

module.exports = (postsStore, imageStore) => {
  router.postsStore = postsStore;
  router.imageStore = imageStore;
  return router;
};
