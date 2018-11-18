'use strict';

const NotFoundError = require(`../../error/not-found-error`);
const asyncMiddleware = require(`./async-middleware`);

module.exports = (router) => {
  router.get(
      `/:date`,
      asyncMiddleware(async (req, res) => {
        const date = parseInt(req.params.date, 10);
        const post = await router.postsStore.getPost(date);

        if (!post) {
          throw new NotFoundError(`Не найден пост с датой`);
        }

        res.send(post);
      })
  );
};
