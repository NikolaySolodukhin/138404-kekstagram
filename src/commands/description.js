'use strict';

const {description} = require(`../../package`);
const {printCommand, exitSucces} = require(`./utils`);

const {cyan} = require(`colors/safe`);

module.exports = {
  name: `description`,
  description: `Print description of the project`,
  execute() {
    printCommand(cyan(description));
    exitSucces();
  }
};
