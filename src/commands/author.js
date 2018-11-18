'use strict';

const {author} = require(`../../package`);
const {printCommand, exitSucces} = require(`./utils`);
const {yellow} = require(`colors/safe`);

module.exports = {
  name: `author`,
  description: `Print author name`,
  execute() {
    printCommand(yellow(author));
    exitSucces();
  }
};
