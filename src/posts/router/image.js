'use strict';

const NotFoundError = require(`../../error/not-found-error`);
const logger = require(`../../logger`);
const IllegalArgumentError = require(`../../error/illegal-argument-error`);
const asyncMiddleware = require(`./async-middleware`);

module.exports = (router) => {
  router.get(
      `/:date/image`,
      asyncMiddleware(async (req, res) => {
        const date = parseInt(req.params.date, 10);

        if (!date) {
          throw new IllegalArgumentError(`В запросе не указана дата`);
        }

        const post = await router.postsStore.getPost(date);

        if (!post) {
          throw new NotFoundError(`Пост с датой ${date} не найден`);
        }

        const {stream, info} = await router.imageStore.get(post._id);

        res.set({
          "Content-Type": post.filename.mimetype,
          "Content-Length": info.length
        });

        res.on(`error`, (e) =>
          logger.error(`Error with GET /:date/image response`, e)
        );
        res.on(`end`, () => res.end());
        stream.on(`error`, (e) =>
          logger.error(`Error with /:date/image stream`, e)
        );
        stream.on(`end`, () => res.end());
        stream.pipe(res);
      })
  );
};
