const mysql = require('../MySQLConnection.js');
const conn = new mysql.MySQLConnection('username', 'password');

function main() {
  var cond = {'AND':[
    {'OR':[
      {'field':'field1', 'value':'value1'},
      {'field':'field2', 'value':'value2'}
    ]},
    {'field':'field3', 'value':'value3'}
  ]}

  conn.select('database', 'table', ['*'], cond, function(err, res) {
    if (err)
    {
      console.log(`error: ${err.message}`);
      return;
    }
    console.log(res);
    return
  });
}

main();
