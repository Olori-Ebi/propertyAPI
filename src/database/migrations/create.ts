const users = `CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    address VARCHAR(100) NOT NULL,
    password VARCHAR(128) NOT NULL,
    phoneNumber VARCHAR(128) NOT NULL,
    isAdmin BOOLEAN DEFAULT FALSE
    );`;

const property = `
    DROP TYPE IF EXISTS property_status;
    CREATE TYPE property_status as ENUM ('sold','available');
    CREATE TABLE IF NOT EXISTS property(
    id SERIAL PRIMARY KEY NOT NULL,
    owner INTEGER REFERENCES users(id) NOT NULL,
    status property_status DEFAULT 'available',
    price FLOAT NOT NULL,
    state VARCHAR(30) NOT NULL,
    city VARCHAR(128) NOT NULL,
    address text NOT NULL,
    type VARCHAR(128) NOT NULL,
    created_on TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    image_url text NOT NULL
    );`;

const createTables = `${users}${property}`;
export default createTables;
