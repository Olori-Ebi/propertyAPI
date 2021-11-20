const dropUserTable = `DROP TABLE IF EXISTS users CASCADE;`;
const dropPropertyTable = `DROP TABLE IF EXISTS property CASCADE;`;

const dropTables = `${dropUserTable}${dropPropertyTable}`;

export default dropTables;
