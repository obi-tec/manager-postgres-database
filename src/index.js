const connection         = require('./_connection');
const knex               = require('knex').knex({ client: 'pg' });
const knexFiltersBuilder = require('./knex/filters-builder');
const filtersBuilder     = require('./_filters-builder');
const paginationBuilder  = require('./_pagination-builder');

module.exports = {
  DatabaseConnection : connection,
  knexInstance       : knex,
  knexFiltersBuilder,
  filtersBuilder,
  paginationBuilder
};