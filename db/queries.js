const pool = require("./pool");

exports.getAllClients = async () => {
  const { rows } = await pool.query("SELECT * FROM clients");
  return rows;
};
