<p align="center">
  <a href="https://www.obitec.com.br/" target="_blank">
    <img src="https://media-exp1.licdn.com/dms/image/C4D0BAQEF_yY60ZuXMw/company-logo_100_100/0/1612555454150?e=1659571200&v=beta&t=J5EkLoozUME9lupU-MSfXHSWOqAfVnNrd320Xa9BPLM"/>
  </a>
</p>

<a name="description"></a>

# Manager Postgres Database
<p align="center">🚀 A simple library to help developers to manage connections and queries on postgres database</p>


<a name="content"></a>

###  🏁 Content
<!--ts-->
   * [Install](#install)
   * [Environment Variables](#environment-variables)
   * [How to use](#how-to-use)
   * [Status](#status)
<!--te-->

<br>
<a name="install"></a>

# Install
```bash
npm install @obi-tec/manager-postgres-database
```
See all tags clicking <a href="https://github.com/obi-tec/manager-postgres-database/tags"> here</a>.

<br>
<a name="environment-variables"></a>

# Environment Variables
```env
  APPLICATION_NAME='api-name-dev-v1'

  # Options for database master:
  DB_HOST='localhost:9090'
  DB_PORT='5432'
  DB_USER='postgres'
  DB_PASSWORD=''
  DB_DATABASE='postgres'`

  # Options for database read:
  RO_DB_HOST='localhost:9090'
  RO_DB_PORT='5432'
  RO_DB_USER='postgres'
  RO_DB_PASSWORD=''
  RO_DB_DATABASE='postgres'
```

<br>
<a name="how-to-use"></a>
# How to Use
In your file.js, import the dependency and extract the DatabaseConnection.

``` javascript
  const { DatabaseConnection } = require('@obi-tec/manager-postgres-database');
```

<br>

### Using DatabaseConnection
We are used to using two types of instances: read and write. By the way, when you will use this function, remember to inform which of the options you wanna use.

Example:
``` javascript
  const query  = 'SELECT * FROM user WHERE id = $1';
  const userId = 1;

  await DatabaseConnection.getInstance().connect();

  // passing true value if you want to use database read-only
  // await DatabaseConnection.getInstance(true).connect();

  const user = await DatabaseConnection.getInstance().queryFirstOrNull('getUserById', query, [userId]);
  await DatabaseConnection.getInstance().disconnect();
```
<br>
<a name="status"></a>

# Status
<h4 align="center">
	🚧  Open for contribuitions...   🚧
</h4>