const pgp = require("pg-promise")();
const db = pgp({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DB,
});
module.exports = db;
