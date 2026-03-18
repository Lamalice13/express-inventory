#! /opt/homebrew/bin/node
const { Client } = require("pg");
require("dotenv").config();

const SQL = `
BEGIN;
CREATE TYPE sub_status AS ENUM ('inactive', 'active');

CREATE TABLE IF NOT EXISTS clients(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    birthday DATE NOT NULL,
    CHECK(birthday < (CURRENT_DATE - INTERVAL '18 years')),
    phone_number VARCHAR(10),
    CHECK(phone_number ~ '^0[0-9]{9}$'),
    inscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sub_status sub_status DEFAULT 'inactive'
);

CREATE TYPE payment_method AS ENUM ('cash', 'cb');

CREATE TABLE subscriptions(
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id) ON DELETE CASCADE,
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    sub_end_date DATE 
);

CREATE TABLE IF NOT EXISTS payments(
    id SERIAL PRIMARY KEY,
    subscription_id INT REFERENCES subscriptions(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    method payment_method NOT NULL
);
COMMIT;
`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();
