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
        return callback(conerr, null, null);
      }
      conn.query(query, pr, function(err, data, fd) {
        conn.release();
        return callback(err, data, fd);
      });
    });
  }

  select(db, tb, fields, cond, callback)
  {
    var query = "";
    if (typeof db === 'string' && typeof tb === 'string') // single table query
    {
      query = `SELECT ${fieldsStringnify(fields, tb)} FROM ${db}.${tb} WHERE ` + conditionParser(cond);
    }
    else if(Array.isArray(tb))
    {
      var flag = false;
      query = 'SELECT';
      for (const i of fields)
      {
        query += flag===true?',':'';
        flag = true;
        query += ` ${i['table']?i['table']:i['tb']}.${i['field']?i['field']:i['fd']}${i['as']?` AS ${i['as']}`:''}`;
      }
      query += ' FROM';
      flag = false;
      for (const i of tb)
      {
        query += (flag===true)?',':'';
        flag = true;
        if (typeof i === 'string') // assuming all table from same db as not specified, thus db must be string
        {
          query += ` ${db}.${i}`;
        }
        else
        {
          query += ` ${typeof db==='string'?db:i['db']?i['db']:i['database']}.${i['tb']?i['tb']:i['table']}${i['as']?` AS ${i['as']}`:''}`;
        }
      }
      query += ' WHERE ' + conditionParser(cond);
    }
    else
    {
      throw new Error({'TypeError':'invalid parameters'});
    }
    this.pool.getConnection(function(connerr, conn) {
      if (connerr)
      {
        return callback(connerr, null, null);
      }
      conn.query(query, function(err, data, fd) {
        conn.release();
        return callback(err, data, fd);
      });
    });
  }

  delete(db, tb, cond, callback)
  {
    var query = `DELETE FROM ${db}.${tb} WHERE ` + conditionParser(cond);
    this.pool.getConnection(function(connerr, conn) {
      if (connerr)
      {
        return callback(connerr, null, null);
      }
      conn.query(query, function(err, data, fd) {
        conn.release();
        return callback(err, data, fd);
      });
    });
  }

  update(db, tb, values, cond, callback)
  {
    var valueStr = "";
    for (const i in values)
    {
      valueStr += ((valueStr.length > 0) ? ', ' : '') + `${i}=${values[i]}`;
    }
    var query = `UPDATE ${db}.${tb} SET ` + valueStr + " WHERE " + conditionParser(cond);
    this.pool.getConnection(function(connerr, conn) {
      if (connerr)
      {
        return callback(connerr, null, null);
      }
      conn.query(query, function(err, data, fd) {
        conn.release();
        return callback(err, data, fd);
      });
    });
  }

  query (query, value, callback)
  {
    callback = callback==null?value:callback;
    this.pool.getConnection(function(connerr, conn) {
      if (connerr)
      {
        return callback(connerr, null, null);
      }
      else
      {
        if (typeof value === 'function')
        {
          conn.query(query, function(err, data, fd) {
            conn.release();
            conn = null;
            return callback(err, data, fd);
          });
        }
        else
        {
          conn.query(query, value, function(err, data, fd) {
            conn.release();
            conn = null;
            return callback(err, data, fd);
          });
        }
        conn.release();
        return;
      }
    })
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
  function parseCondObject(obj) {
    const tmpkey = Object.keys(obj);
    if (obj.length === 2)
    {
      return `${obj['table']?obj['table']:obj['tb']}.${obj['field']?obj['field']:obj['fd']}`;
    }
    else if (obj.length === 1)
    {
      return `${tmpkey[0]}.${obj[tmpkey[0]]}`;
    }
    else
    {
      throw new Error({'TypeError':'Invalid Condition Object'});
    }
  }
  const key = Object.keys(conditions);
  if (conditions == null)
  {
    return "";
  }
  else if (inArray('field', key) && inArray('value', key))
  {
    return `\`${typeof conditions['field'] === 'string' ? conditions['field'] : parseCondObject(conditions['field'])}\` ${(conditions['relation']==undefined)?'=':conditions['relation']} ${(typeof (conditions['value']) === 'number')?conditions['value']:typeof conditions['value'] === 'string' ? `"${conditions['value']}"` : parseCondObject(conditions['value'])}`;
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
