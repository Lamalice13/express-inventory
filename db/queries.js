const pool = require("./pool");

exports.getAllClients = async () => {
  const { rows } = await pool.query("SELECT * FROM clients");
  return rows;
};

exports.createSubClient = async (
  name,
  lastname,
  email,
  birth_date,
  phone_number,
  sub_status,
  start_date,
  end_date,
  sub_type,
  amount,
  method
) => {
  const client = await pool.query(
    "INSERT INTO clients(name, lastname, email, birth_date, phone_number, sub_status) VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
    [name, lastname, email, birth_date, phone_number, sub_status]
  );
  const client_id = client.rows[0].id;

  const sub = await pool.query(
    "INSERT INTO subscriptions(client_id, start_date, end_date, sub_type) VALUES($1, $2, $3, $4) RETURNING id",
    [client_id, start_date, end_date, sub_type]
  );
  const sub_id = sub.rows[0].id;

  await pool.query(
    "INSERT INTO payments(subscription_id, amount, method) VALUES($1, $2, $3)",
    [sub_id, amount, method]
  );
};

exports.createUnsubClient = async (
  name,
  lastname,
  email,
  birth_date,
  phone_number,
  sub_status
) => {
  await pool.query(
    "INSERT INTO clients(name, lastname, email, birth_date, phone_number, sub_status) VALUES($1, $2, $3, $4, $5, $6)",
    [name, lastname, email, birth_date, phone_number, sub_status]
  );
};

exports.findUserByEmail = async (email) => {
  const user = await pool.query("SELECT * FROM clients WHERE email=$1", [
    email,
  ]);
  return user.rows[0];
};

exports.findUserByPhone = async (phone) => {
  const user = await pool.query("SELECT * FROM clients WHERE phone_number=$1", [
    phone,
  ]);
  return user.rows[0];
};
