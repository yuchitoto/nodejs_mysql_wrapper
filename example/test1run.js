const mysql = require('../MySQLConnection.js');
const conn = new mysql.MySQLConnection('csci3100grp18', 'csci3100#Grp18');

function main() {
  var cond = {'AND':[
    {'OR':[
      {'field':'author', 'value':'入间人间'},
      {'field':'author', 'value':'野村美月'}
    ]},
    {'field':'available', 'value':'true'}
  ]}

  conn.select('book', 'wenku8', ['*'], cond, function(err, res) {
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
