'use strict';

const MongoError = require(`mongodb`).MongoError;
const ValidateError = require(`../error/validate`);
const logger = require(`../logger`);
const NotFoundError = require(`./not-found-error`);

const NOT_FOUND_HANDLER = (req, res) =>
  res.status(404).send(`Page was not found`);

const ERROR_HANDLER = (err, req, res, _next) => {
  logger.error(err.message, err);

  if (err instanceof ValidateError) {
    res.status(err.code).json(err.errors);
    return;
  }

  if (err instanceof MongoError) {
    res.status(400).json(err.message);
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(err.code).json(err.message);
    return;
  }

  res.status(err.code || 500).send(err.message);
};

module.exports = {
  NOT_FOUND_HANDLER,
  ERROR_HANDLER
};
