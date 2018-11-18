'use strict';

const ValidateError = require(`../error/validate`);
const data = require(`./data`);

const validateHashtags = require(`./validateHashtags`);
const requaries = [`filename`, `scale`, `effect`];

const validate = (body) => {
  const errors = [];
  const {filename, scale, effect, description, hashtags} = body;

  const setError = (field, message) =>
    errors.push({
      error: `Validation Error`,
      fieldName: field,
      errorMessage: message
    });

  requaries.forEach((field) => {
    if (!(field in body)) {
      setError(field, `Field '${field}' is required!`);
    }
  });

  if (errors.length) {
    throw new ValidateError(errors);
  }

  if (!data.fileType.test(filename.mimetype)) {
    setError(`filename`, `Field 'filename' must be a image type!`);
  }

  if (scale < data.scaleMin || scale > data.scaleMax) {
    setError(`scale`, `Field 'scale' must be in range from ${data.scaleMin} to ${data.scaleMax}!`);
  }

  if (!data.effects.includes(effect)) {
    setError(`effect`, `Field 'effect' must be one of the following: ${data.effects.join(`, `)}!`);
  }


  if (description && description > data.descriptionMax) {
    setError(
        `description`,
        `Field 'descriptoin' must be less then ${data.descriptionMax} charsets!`
    );
  }

  if (Array.isArray(hashtags)) {
    const list = hashtags;

    validateHashtags.forEach((item) => {
      if (item.condition(list)) {
        setError(`hashtags`, item.error);
      }
    });
  }

  if (errors.length > 0) {
    throw new ValidateError(errors);
  }

  return body;
};

module.exports = validate;
