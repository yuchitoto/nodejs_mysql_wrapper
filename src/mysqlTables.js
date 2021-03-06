const mysql = require('./mysqlDB.js');
let MySQLDatabase = mysql.MySQLDatabase;
let MySQLDatabaseConnection = mysql.MySQLDatabaseConnection;


class MySQLTable extends MySQLDatabase {
  constructor(connection, database, table) {
    super(connection, database);
    this.tb = table;
  }

  insert(values, callback)
  {
    super.insert(this.tb, values, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }

  select(fields, cond, callback)
  {
    super.select(this.tb, fields, cond, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }

  delete(cond, callback)
  {
    super.delete(this.tb, cond, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }

  update(values, cond, callback)
  {
    super.update(this.tb, values, cond, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }
}


class MySQLTableConnection extends MySQLDatabaseConnection {
  constructor(user, password, database, table, host='localhost', port=3306, numConn=10, qLimit=10000) {
    super(user, password, host, database, port, numConn, qLimit);
    this.tb = table;
  }

  insert(values, callback)
  {
    super.insert(this.tb, values, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }

  select(fields, cond, callback)
  {
    super.select(this.tb, fields, cond, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }

  delete(cond, callback)
  {
    super.delete(this.tb, cond, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }

  update(values, cond, callback)
  {
    super.update(this.tb, values, cond, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }
}


module.exports = {MySQLTable:MySQLTable, MySQLTableConnection:MySQLTableConnection};
