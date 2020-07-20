const mysql = require('mysql');


/*
  mysql connection class provides basic functions for table manupulation
  uses pool for connections
*/
class MySQLConnection {
  constructor(user, password, host='localhost', port=3306, numConn=10, qLimit=10000) {
    this.params = {
      "host":host,
      "port":port,
      "user":user,
      "password":password,
      "connectionLimit":numConn,
      "waitForConnections":true,
      "queueLimit":qLimit,
      "acquireTimeout":50000
    };
    this.pool = mysql.createPool(this.params);
  }

  insert(db, tb, values, callback)
  {
    var query = `INSERT INTO ${db}.${tb} SET ?`;
    const key = Object.keys(values);
    const value = Object.values(values);
    var pr = [];
    for(var i=0; i<key.length;i++)
    {
      if(i>0) {
        query += ", ?";
      }
      pr.push({[key[i]]:value[i]});
    }
    this.pool.getConnection(function(conerr, conn) {
      if (conerr)
      {
        return callback(conerr, null);
      }
      conn.query(query, pr, function(err, res) {
        callback(err, res);
        conn.release();
        return;
      });
    });
  }

  select(db, tb, fields, cond, callback)
  {
    var query = `SELECT ${fieldsStringnify(fields, tb)} FROM ${db}.${tb} WHERE ` + conditionParser(cond);
    this.pool.getConnection(function(connerr, conn) {
      if (connerr)
      {
        return callback(connerr, null);
      }
      conn.query(query, function(err, res) {
        callback(err, res);
        conn.release();
        return;
      });
    });
  }

  delete(db, tb, cond, callback)
  {
    var query = `DELETE FROM ${db}.${tb} WHERE ` + conditionParser(cond);
    this.pool.getConnection(function(connerr, conn) {
      if (connerr)
      {
        return callback(connerr, null);
      }
      conn.query(query, function(err, res) {
        callback(err, res);
        conn.release();
        return;
      });
    });
  }

  update(db, tb, values, cond, callback)
  {
    var valueStr = "";
    const tmpkey = Object.keys(values);
    for (const i of tmpkey)
    {
      valueStr += ((valueStr.length > 0) ? ', ' : '') + `${i}=${values[i]}`;
    }
    var query = `UPDATE ${db}.${tb} SET ` + valueStr + " WHERE " + conditionParser(cond);
    this.pool.getConnection(function(connerr, conn) {
      if (connerr)
      {
        return callback(connerr, null);
      }
      conn.query(query, function(err, res) {
        callback(err, res);
        conn.release();
        return;
      });
    });
  }
}


function fieldsStringnify(fields, table)
{
  var fieldStr = "";
  for (const i of fields)
  {
    fieldStr += ((fieldStr.length > 0) ? ', ' : '') + table + '.' + i;
  }
  return fieldStr;
}

function inArray(datum, array)
{
  if(Array.isArray(array) && !Array.isArray(datum))
  {
    for (const i of array)
    {
      if (datum == i)
      {
        return true;
      }
    }
    return false;
  }
  else
  {
    throw new Error({'TypeError':'Array Object Expected for array and scalar object expected for datum'});
  }
}

/*
  parse conditions to form condition string for query
  input: nested dictionary contains only one key in each layer, but spawns as tree, array of string or dictionary as values
  output: parsed condition string

  desc:
  decode symbol tree recursively with dict key as condition, dict val as elems using the condition in the same logical layer
  each elem shall either be another condition tree or terminating obj with single field and value

  expects:
  valid key as field/key/{condition keywords}
*/

function conditionParser(conditions)
{
  const key = Object.keys(conditions);
  if (conditions == null)
  {
    return "";
  }
  else if (inArray('field', key) && inArray('value', key) && key.length == 2)
  {
    return `\`${conditions['field']}\`=${(typeof (conditions['value']) === 'number')?conditions['value']:`"${conditions['value']}"`}`;
  }
  else if (key.length == 1)
  {
    var condStr = "";
    // parse conditions
    for (const i of conditions[key[0]])
    {
      condStr += ((condStr.length > 0) ? ` ${key[0]} (` : '(') + conditionParser(i) + ')';
    }
    return condStr;
  }
  else
  {
    throw new Error({'TypeError':'Valid condition tree expected, invalid element in tree'});
  }
}

// export class definition
module.exports = {MySQLConnection:MySQLConnection};
