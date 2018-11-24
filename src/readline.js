'use strict';

const readline = require(`readline`);
const {
  red,
  green,
  black
} = require(`colors/safe`);

const {
  generateData
} = require(`../test/mock/generate`);

const {
  exitSucces,
  exitWithError,
  printCommand,
  printCommandError
} = require(`./commands/utils`);

const fs = require(`fs`);

class Readline {
  constructor(params) {
    this.data = null;

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    },
    params
    );

    this.rl
      .on(`close`, () => {
        printCommand(green(`Thanks, goodbay!`));
        exitSucces();
      })
      .on(`error`, (err) => {
        printCommandError(red(err));
        exitWithError();
      });
  }

  init() {
    this.rl.question(`Hey user, do you need data? (Y/N) `, (answer) => {
      answer = answer.toLowerCase();
      switch (answer) {
        case `n`:
        case `no`:
          this.rl.close();
          break;
        case `y`:
        case `yes`:
          this.getValue();
          break;
        default:
          this.init();
      }
    });
  }

  getValue() {
    this.rl.question(`How many elements do you need? `, (answer) => {
      answer = parseInt(answer, 10);
      if (answer) {
        this.data = generateData(answer);
        this.getPath();
      } else {
        printCommand(red(`Value must be a number`));
        this.getValue();
      }
    });
  }

  getPath() {
    this.rl.question(`Where to put this data? `, (path) => {
      const fileIsFound = Readline.findFile(path);

      switch (fileIsFound) {
        case true:
          this.replaceFile(path);
          break;
        case `repeatQuestion`:
          this.getPath();
          break;
        case false:
          Readline.writeFile(path, this.data);
          this.rl.close();
          break;
      }

    });
  }

  replaceFile(path) {
    this.rl.question(`File already created, replace it? (Y/N) `, (answer) => {
      answer = answer.toLowerCase();
      switch (answer) {
        case `y`:
        case `yes`:
          Readline.writeFile(path);
          this.rl.close();
          break;
        case `n`:
        case `no`:
          this.getPath();
          break;
        default:
          this.replaceFile(path);
      }
    });
  }

  static findFile(path) {
    try {
      fs.statSync(path);
    } catch (err) {
      if (err.code === `ENOENT` && path === ``) {
        return `repeatQuestion`;
      } else {
        return false;
      }
    }
    return true;
  }

  static writeFile(path, data) {
    fs.writeFileSync(path, JSON.stringify(data));
    printCommand(black.underline(`File was created!`));
  }

  static unlink(path) {
    fs.unlinkSync(path);
    printCommand(red(`File was deleted!`));
  }
}

module.exports = {
  Readline
};
