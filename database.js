const mysql = require('mysql2');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysql.createPool({
    host: 'localhost',
     user: 'root',
     password:'',
     port:'3306',
     database: 'trade',
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0
});

exports.query = (sql, callback) => {
    return new Promise(function(resolve, reject) {
        pool.query(sql, function(err, rows, fields) {
            if (err){
                reject(err)
            }
            resolve(rows)
 })
    })
};