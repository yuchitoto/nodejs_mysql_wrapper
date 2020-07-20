const mysql = require('./mysqlConnection.js');
let MySQLConnection = mysql.MySQLConnection;


class MySQLDatabase {
  constructor(connection, database) {
    this.conn = connection;
    this.db = database;
  }

  insert(tb, values, callback)
  {
    this.conn.insert(this.db, tb, values, function(err, res) {
      return callback(err, res);
    });
  }

  select(tb, fields, cond, callback)
  {
    this.conn.select(this.db, tb, fields, cond, function(err, res) {
      return callback(err, res);
    });
  }

  delete(tb, cond, callback)
  {
    this.conn.delete(this.db, tb, cond, function(err, res) {
      return callback(err, res);
    });
  }

  update(tb, values, cond, callback)
  {
    this.conn.update(this.db, tb, values, cond, function(err, res) {
      return callback(err, res);
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
    super.insert(this.db, tb, values, function(err, res) {
      return callback(err, res);
    });
  }

  select(tb, fields, cond, callback)
  {
    super.select(this.db, tb, fields, cond, function(err, res) {
      return callback(err, res);
    });
  }

  delete(tb, cond, callback)
  {
    super.delete(this.db, tb, cond, function(err, res) {
      return callback(err, res);
    });
  }

  update(tb, values, cond, callback)
  {
    super.update(this.db, tb, values, cond, function(err, res) {
      return callback(err, res);
    });
  }
}


module.exports = {MySQLDatabase:MySQLDatabase, MySQLDatabaseConnection:MySQLDatabaseConnection};
