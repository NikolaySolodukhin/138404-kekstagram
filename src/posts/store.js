'use strict';

const db = require(`../database/db`);
const logger = require(`../logger`);

const setupCollection = async () => {
  const dBase = await db;
  const collection = dBase.collection(`posts`);
  collection.createIndex(
      {
        date: 1
      },
      {
        unique: true
      }
  );
  return collection;
};

class PostsStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getPost(date) {
    return (await this.collection).findOne({
      date
    });
  }

  get allPosts() {
    return (async () => (await this.collection).find())();
  }

  async save(data) {
    return (await this.collection).insertOne(data);
  }

  async drop() {
    return (await this.collection).drop((err, deleteSuccess) => {
      if (err) {
        logger.error(`Unexpected result. Please restart programm. ${err}`);
      }

      if (deleteSuccess) {
        logger.info(`kekstagram-post collection deleted`);
      }

      this.collection = setupCollection();
    });
  }
}

module.exports = new PostsStore(
    setupCollection().catch((err) =>
      logger.error(`Field to setup collections 'posts'`, err)
    )
);
