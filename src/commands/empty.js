'use strict';

const {author, name} = require(`../../package`);
const {printCommand} = require(`./utils`);

module.exports = {
  name: `helloUser`,
  description: `Shows program help`,
  execute() {
    printCommand(
        `Hello user!\n${`This program will start «${name}» server.\nAuthor: ${author}.`}`
    );
  }
};
