// dependencies
const _        = require('lodash');
const { Pool } = require('pg');
const pgFormat = require('pg-format');
const logger   = require('@obi-tec/logger-console');

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

const instances = {};

class Database {
  constructor(connectionName = 'default', connectionSettings = {}, readConnectionSettings = {}, isRead = false, enableLogs = false, camelizeKeys = true) {
    /** @type {import("pg").PoolClient} */
    this.connectionName         = connectionName;
    this.connectionSettings     = connectionSettings;
    this.readConnectionSettings = readConnectionSettings;
    this.isRead                 = isRead;
    this.enableLogs             = enableLogs;
    this.camelizeKeys           = camelizeKeys;
    this.poolClient             = null;
  }

  async connect() {
    let connectionSettings = {
      idleTimeoutMillis       : 5000,
      connectionTimeoutMillis : 10000,
      allowExitOnIdle         : true,
      ...this.connectionSettings
    };

    if (this.isRead && this.readConnectionSettings?.host) {
      connectionSettings = {
        ...connectionSettings,
        ...this.readConnectionSettings
      };
    } else if (!this.isRead && this.connectionSettings?.host) {
      connectionSettings = {
        ...connectionSettings,
        ...this.connectionSettings
      };
    } else if (this.readConnectionSettings?.host) {
      connectionSettings = {
        ...connectionSettings,
        ...this.readConnectionSettings
      };
    } else {
      connectionSettings = {
        ...connectionSettings,
        ...this.connectionSettings
      };
    }

    const pool               = new Pool(connectionSettings);
    const initOpenConnection = Date.now();
    this.poolClient          = await pool.connect();
    const endOpenConnection  = Date.now();

    if (this.enableLogs) {
      logger.info('Time to open connection database', endOpenConnection - initOpenConnection);
    }
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
      await this.connect();
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
        return this.camelizeKeys ? _camelizeKeys(result.rows) : result.rows;
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
  async queryFirstOrNull (name, text, values = [], scapeValues = []) {
    if (!this.poolClient) {
      await this.connect();
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
        if (result.rowCount > 0) {
          return this.camelizeKeys ? _camelizeKeys(result.rows[0]) : result.rows[0];
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
  static getInstance(
    connectionName = 'default',
    {
      connectionSettings = {
        application_name : '',
        min              : 0,
        max              : 1,
        host             : '',
        port             : '',
        user             : '',
        password         : '',
        database         : ''
      },
      readConnectionSettings = {
        application_name : '',
        min              : 0,
        max              : 1,
        host             : '',
        port             : '',
        user             : '',
        password         : '',
        database         : ''
      },
      isRead = false,
      enableLogs = false,
      camelizeKeys = true
    } = {}) {
    if (typeof instances[connectionName] === 'undefined') {
      instances[connectionName] = new Database(connectionName, connectionSettings, readConnectionSettings, isRead, enableLogs, camelizeKeys);
    }

    instances[connectionName].isRead = isRead;
    return instances[connectionName];
  }
}

module.exports = DatabaseConnection;