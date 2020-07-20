const conn = require('./src/mysqlConnection.js');
const db = require('./src/mysqlDB.js');
const tb = require('./src/MySQLTable.js');

module.exports = {
  MySQLConnection:conn.MySQLConnection,
  MySQLDatabase:db.MySQLDatabase,
  MySQLDatabaseConnection:db.MySQLDatabaseConnection,
  MySQLTable:tb.MySQLTable,
  MySQLTableConnection:tb.MySQLTableConnection
};
