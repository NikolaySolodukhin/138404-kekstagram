"use strict";

const db = require(`../database/db`);
const mongodb = require(`mongodb`);
const NUMBER_OF_BYTES_IN_ONE_KILOBYTE = 1024;
const NUMBER_KILOBYTE = 512;

class ImageStore {
  async _bucket() {
    if (this._bucketStore) {
      return this._bucketStore;
    }

    const dBase = await db;

    if (!this._bucketStore) {
      this._bucketStore = new mongodb.GridFSBucket(dBase, {
        chunkSizeBytes: NUMBER_KILOBYTE * NUMBER_OF_BYTES_IN_ONE_KILOBYTE,
        bucketName: `avatars`
      });
    }

    return this._bucketStore;
  }

  async get(filename) {
    const bucket = await this._bucket();
    const results = await bucket
      .find({
        filename
      })
      .toArray();
    const entity = results[0];

    if (!entity) {
      return void 0;
    }

    return {
      info: entity,
      stream: bucket.openDownloadStreamByName(filename)
    };
  }

  async save(filename, stream) {
    const bucket = await this._bucket();
    return new Promise((success, fail) =>
      stream
        .pipe(bucket.openUploadStream(filename))
        .on(`error`, fail)
        .on(`finish`, success)
    );
  }
}

module.exports = new ImageStore();
