var mysql = require('mysql');

/*var pool = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'Immu497@',
  database : 'couponcr_crown'
});*/

var pool = mysql.createPool({
  host     : '127.0.0.1',
  port     : 3306,
  user     : 'root',
  password : 'Immu497@',
  database : 'couponcr_crown'
});

module.exports = (cb) => {
  pool.getConnection((err, connection) => {
    if(err){
      console.log(err);
      return cb(err);
    }
    return cb(null, connection);
  });
};
