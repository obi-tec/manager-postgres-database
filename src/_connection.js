// dependencies
const _        = require('lodash');
const { Pool } = require('pg');
const pgFormat = require('pg-format');

// privates
const _camelizeKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => _camelizeKeys(v));
  } else if (_.isPlainObject(obj)) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [_.camelCase(key)]: _camelizeKeys(obj[key])
      }),
      {}
    );
  }
  return obj;
};

let instance;

class Database {
  constructor(read = false) {
    /** @type {import("pg").PoolClient} */
    this.poolClient = null;
    this.isRead     = read;
  }

  async connect() {
    let connectionSettings = {
      application_name : process.env.APPLICATION_NAME,
      min              : process.env.POOL_MIN || 0,
      max              : process.env.POOL_MAX || 1,

      idleTimeoutMillis       : 5000,
      connectionTimeoutMillis : 10000,
      allowExitOnIdle         : true
    };

    if (this.isRead) {
      connectionSettings = {
        ...connectionSettings,        
        host     : process.env.RO_DB_HOST,
        port     : process.env.RO_DB_PORT,
        user     : process.env.RO_DB_USER,
        password : process.env.RO_DB_PASSWORD,
        database : process.env.RO_DB_DATABASE
      };
    } else {
      connectionSettings = {
        ...connectionSettings,  
        host     : process.env.DB_HOST,
        port     : process.env.DB_PORT,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_DATABASE
      };
    }

    const pool      = new Pool(connectionSettings);
    this.poolClient = await pool.connect();
  }
  
  /**
 * This method execute a query.
 * @param {string} name - Name of query.
 * @param {string} text - Text of query to execute.
 * @param {Array.<object>} values - Parameters passed to query
 * @return {Promise.<Array>} Promise with a result rows.
 */
  async query (name, text, values = [], scapeValues = []) {
    if (!this.poolClient) {
      throw new Error('You must initialize connection database before querying');
    }

    if (scapeValues.length) {
      text = pgFormat(text, ...scapeValues);
    }

    const query = {
      name,
      text,
      values
    };

    return this.poolClient.query(query)
      .then(result => {
        return _camelizeKeys(result.rows);
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  /**
 * This method execute a query and return an object.
 * @param {string} name - Name of query.
 * @param {string} query - Text of query to execute.
 * @param {Array.<object>} values - Parameters passed to query
 * @return {Promise.<Object>} Promise with a result rows.
 */
  async queryFirstOrNull (name, text, values = []) {
    if (!this.poolClient) {
      throw new Error('You must initialize connection database before querying');
    }

    const query = {
      name,
      text,
      values
    };

    return this.poolClient.query(query)
      .then(result => {
        if (result.rowCount > 0) {
          return _camelizeKeys(result.rows[0]);
        }
        return null;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }


  async closeConnection() {
    if (this.poolClient) {
      this.poolClient.release(true);
    }
  }
}

class DatabaseConnection {
  constructor() {
    throw new Error('Database connection cannot be instantiated');
  }

  /**
   * @returns {Database}
   */
  static getInstance(read) {
    if (!instance) {
      instance = new Database(read);
    }
    return instance;
  }
}

module.exports = DatabaseConnection;