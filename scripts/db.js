const file = __dirname + '/site.db';
let sqlite3 = require('sqlite3');
let db = new sqlite3.Database(file);
module.exports = db;
