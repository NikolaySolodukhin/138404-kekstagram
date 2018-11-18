'use strict';

const data = require(`./data`);

const conditions = [{
  condition(list) {
    return list.length > data.hashtagsMaxLength;
  },
  error: `Field 'hashtags' must be less then ${data.hashtagsMaxLength} hashtags!`,
}, {
  condition(list) {
    return list.some((hash) => !hash.startsWith(`#`));
  },
  error: `All hashtags must begins with '#' symbol!`
}, {
  condition(list) {
    return list.some((hash) => hash.length < data.hashtagsMinWord + 1 || hash.length > data.hashtagsMaxWord);
  },
  error: `All hashtags length must be in range from ${data.hashtagsMinWord} to ${data.hashtagsMaxWord}!`
}, {
  condition(list) {
    return list
      .map((hash) => hash.toLowerCase())
      .some((hash) => list.indexOf(hash) !== list.lastIndexOf(hash));
  },
  error: `All hashtags must be unique!`,
}];

module.exports = conditions;
