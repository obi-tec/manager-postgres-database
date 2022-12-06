// dependencies
const { ErrorHttp } = require('@obi-tec/express-response-models');

const ORDER_TYPES = [
  'ASC',
  'DESC'
];

module.exports = (queryRequest) => {
  const offset = queryRequest.offset ? Number(queryRequest.offset) : 0;
  if (offset < 0) {
    throw new ErrorHttp('Invalid Parameters, offset cannot be negative', 400, 'api-bff-400_invalid-parameters');
  }
  const limit  = queryRequest.limit ? Number(queryRequest.limit) : 20;
  if (limit < 0) {
    throw new ErrorHttp('Invalid Parameters, limit cannot be negative', 400, 'api-bff-400_invalid-parameters');
  }

  const orderBy = queryRequest.orderBy || 'id';
  const orderType = queryRequest.orderType ? queryRequest.orderType.toUpperCase() : 'ASC';
  if (ORDER_TYPES.indexOf(orderType) === -1) {
    throw new ErrorHttp('Invalid Parameters, orderType not valid. User ASC or DESC', 400, 'api-bff-400_invalid-parameters');
  }

  return {
    limit,
    offset,
    orderBy,
    orderType
  };
};