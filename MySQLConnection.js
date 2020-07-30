/**
* MODULES TO CONNECT TO MYSQL DATABASE
*
* CLASS NAME: MySQLDatabase
* PROGRAMMER: YU CHI TO
* VERSION: 1.0.1.1 (8-7-2020)
*/

const conn = require(__dirname + '/src/mysqlConnection.js');
const db = require(__dirname + '/src/mysqlDB.js');
const tb = require(__dirname + '/src/mysqlTables.js');

module.exports = {
  MySQLConnection:conn.MySQLConnection,
  MySQLDatabase:db.MySQLDatabase,
  MySQLDatabaseConnection:db.MySQLDatabaseConnection,
  MySQLTable:tb.MySQLTable,
  MySQLTableConnection:tb.MySQLTableConnection
};
