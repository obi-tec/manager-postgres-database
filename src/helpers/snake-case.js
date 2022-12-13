// dependencies
const _ = require('lodash');

module.exports = (obj) => {
  const snakeFunction = obj => _.transform(obj, (acc, value, key, target) => {
    const camelKey = _.isArray(target) ? key : _.snakeCase(key);

    acc[camelKey] = _.isObject(value) ? snakeFunction(value) : value;
  });

  const result = snakeFunction(obj);
  return result;
};