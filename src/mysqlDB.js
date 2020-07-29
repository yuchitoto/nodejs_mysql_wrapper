const mysql = require('./mysqlConnection.js');
let MySQLConnection = mysql.MySQLConnection;


class MySQLDatabase {
  constructor(connection, database) {
    this.conn = connection;
    this.db = database;
  }

  insert(tb, values, callback)
  {
    this.conn.insert(this.db, tb, values, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }

  select(tb, fields, cond, callback)
  {
    this.conn.select(this.db, tb, fields, cond, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }

  delete(tb, cond, callback)
  {
    this.conn.delete(this.db, tb, cond, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }

  update(tb, values, cond, callback)
  {
    this.conn.update(this.db, tb, values, cond, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }
}


class MySQLDatabaseConnection extends MySQLConnection {
  constructor(user, password, database, host='localhost', port=3306, numConn=10, qLimit=10000) {
    super(user, password, host, port, numConn, qLimit);
    this.db = db;
  }

  insert(tb, values, callback)
  {
    super.insert(this.db, tb, values, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }

  select(tb, fields, cond, callback)
  {
    super.select(this.db, tb, fields, cond, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }

  delete(tb, cond, callback)
  {
    super.delete(this.db, tb, cond, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }

  update(tb, values, cond, callback)
  {
    super.update(this.db, tb, values, cond, function(err, data, fd) {
      return callback(err, data, fd);
    });
  }
}


module.exports = {MySQLDatabase:MySQLDatabase, MySQLDatabaseConnection:MySQLDatabaseConnection};
