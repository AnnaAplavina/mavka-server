const pg = require('pg');

const { Pool } = pg;

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;

const pool = new Pool({
  user: PGUSER,
  password: PGPASSWORD,
  host: PGHOST,
  port: 5432,
  database: PGDATABASE,
  ssl: true,
});

module.exports = pool;
