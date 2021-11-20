import pool from "../db/db";
import createTables from "./create";
import dropTables from "./drop";

const queryTable = () => {
  const populateTable = `${dropTables}${createTables}`;
  pool
    .query(populateTable)
    .then(() => {
      console.log("table created successfully");
      process.exit(0);
    })
    .catch((err) => console.log("ERR", err));
};

queryTable();
