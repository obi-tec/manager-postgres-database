// dependencies
const { ErrorHttp } = require('@obi-tec/express-response-models');

// types
/**
 * @typedef { import("knex").Knex } knex
 * */

// consts
const ENUM_SEARCH_OPERATORS = Object.freeze({
  gt  : '>',
  gte : '>=',
  lt  : '<',
  lte : '<=',
  eq  : '=',
  neq : '<>'
});

// private
const _camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

/**
 * @param { knex } query
 * @returns { knex }
 */
module.exports.build = (query, filters, filtersSuported) => {
  if (filters && typeof filters === 'object') {
    for (const [item, objItem] of Object.entries(filters)) {
      if (filtersSuported.includes(item)) {
        for (const [operator, value] of Object.entries(objItem)) {
          switch (operator) {
            case 'gt':
            case 'gte':
            case 'lt':
            case 'lte':
              query.where(_camelToSnakeCase(item), ENUM_SEARCH_OPERATORS[operator], value);
              break;
            case 'neq':{
              if (value === 'null') {
                query.whereNotNull(_camelToSnakeCase(item));
              } else {
                query.where(_camelToSnakeCase(item), ENUM_SEARCH_OPERATORS[operator], value);
              }
              break;
            }
            case 'eq': {
              if (value === 'null') {
                query.whereNull(_camelToSnakeCase(item));
              } else {
                query.where(_camelToSnakeCase(item), ENUM_SEARCH_OPERATORS[operator], value);
              }
              break;
            }
            case 'like':
              query.where((q) => {
                item.split('|').map(i => {
                  q.orWhereLike(_camelToSnakeCase(i), value);
                });
              });
              break;
            case 'ilike':
              query.where((q) => {
                item.split('|').map(i => {
                  q.orWhereILike(_camelToSnakeCase(i), value);
                });
              });
              break;
            case 'in':
              query.whereIn(_camelToSnakeCase(item), value);
              break;
            default:
              throw new ErrorHttp('Error mounting filters, check the filters sent', 400, 'error.invalid-filters');
          }
        }
      }
    }
  }

  return query;
};
