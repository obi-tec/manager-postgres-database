// dependencies
const { ErrorHttp } = require('@obi-tec/express-response-models');

const ENUM_SEARCH_OPERATORS = Object.freeze({
  gt    : '>',
  gte   : '>=',
  lt    : '<',
  lte   : '<=',
  eq    : '=',
  neq   : '<>',
  like  : 'like',
  ilike : 'ilike',
  in    : 'in'
});

const _camelToSnakeCase = str => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

module.exports.buildFilters = (entity, filters, values) => {
  let where = '';
  let count = 0;
  if (typeof filters === 'object') {
    for (const [item, objItem] of Object.entries(filters)) {
      var and = count > 0 ? ' AND ' : '';
      for (const [operator, value] of Object.entries(objItem)) {
        if (typeof ENUM_SEARCH_OPERATORS[operator] === 'undefined') {
          throw new ErrorHttp('Error mounting filters, check the filters sent', 400, 'damasio-integration-400_invalid-filters');
        }

        if (value) {
          if (operator === 'in') {
            const valueSplit = value.split(',');
            if (valueSplit.length) {
              where += `${and}${entity}.${_camelToSnakeCase(item)} ${ENUM_SEARCH_OPERATORS[operator]} (`;
              for (const val of valueSplit) {
                values.push(decodeURIComponent(val));
                where += `$${values.length},`;
              }
              where = where.slice(0, -1);
              where += ')';
            }
          } else {
            if (['ilike', 'like'].includes(operator)) {
              values.push(`%${decodeURIComponent(value)}%`);
            } else {
              values.push(value);
            }
            where += `${and}${entity}.${_camelToSnakeCase(item)} ${ENUM_SEARCH_OPERATORS[operator]} $${values.length}`;
          }
        }
      }

      count += 1;
    }
  }
  return where;
};
