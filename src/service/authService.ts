import pool from "../database/db/db";

class userQueries {
  static async create(values: string[]) {
    try {
      const exist = await pool.query("SELECT email FROM users WHERE email=$1", [
        values[2],
      ]);

      if (exist.rows.length) {
        return {
          error: {
            status: 409,
            message: "The email adress already exist",
          },
        };
      }
      const user = await pool.query(
        "INSERT INTO users (first_name, last_name, email, address, password, phoneNumber) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        values
      );

      return user;
    } catch (error: any) {
      return {
        error: {
          status: 500,
          message: "Unable to insert data into the users table",
          error: error.message,
        },
      };
    }
  }

  static async login(values: string[]) {
    try {
      const res = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        values
      );

      console.log(res);
      return res;
    } catch (error) {
      return {
        error: {
          status: 500,
          message: "Unable to select data from the users table",
        },
      };
    }
  }
}

export default userQueries;
