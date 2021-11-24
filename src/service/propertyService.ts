import pool from "../database/db/db";

class propertyQueries {
  static async create(values: string[]) {
    try {
      const propertyAd = await pool.query(
        "INSERT INTO property (owner, status, price, state, city, address, type, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        values
      );
      console.log(propertyAd);
      return propertyAd;
    } catch (error: any) {
      return {
        error: {
          status: 500,
          message: "Unable to insert data into the property  table",
          error: error.message,
        },
      };
    }
  }
  static async getAll(type?: string) {
    try {
      if (type) {
        const result = await pool.query(
          `SELECT users.id as ownerID,status,type,state,city,property.address,price,created_on,image_url,email AS ownerEmail,phonenumber AS ownerNumber FROM users JOIN property ON users.id=owner WHERE type=$1`,
          [type]
        );
        return result;
      }
      const result = await pool.query(
        `SELECT users.id as ownerID,status,type,state,city,property.address,price,created_on,image_url,email AS ownerEmail,phonenumber AS ownerNumber FROM users JOIN property ON users.id=owner`
      );

      return result;
    } catch (error: any) {
      return {
        error: {
          status: 500,
          message: "Unable to insert data into the property  table",
          error: error.message,
        },
      };
    }
  }

  static async viewOne(id: string) {
    try {
      const result = await pool.query(
        `SELECT users.id as ownerID,status,type,state,city,property.address,price,created_on,image_url,email AS ownerEmail,phonenumber AS ownerNumber FROM users JOIN property ON users.id=owner WHERE property.id=$1`,
        [+id]
      );

      return result;
    } catch (error: any) {
      return {
        error: {
          status: 500,
          message: "Unable to insert data into the property  table",
          error: error.message,
        },
      };
    }
  }

  static async delete(id: string, propertyid: string) {
    try {
      const getProperty = await pool.query(
        `DELETE FROM property WHERE id=$1 AND owner=$2`,
        [+propertyid, +id]
      );

      return getProperty;
    } catch (error: any) {
      return {
        error: {
          status: 500,
          message: "Unable to insert data into the property  table",
          error: error.message,
        },
      };
    }
  }

  static async sold(id: string, propertyid: string) {
    try {
      const result = await pool.query(
        `UPDATE property SET status=$1 WHERE owner=$2 AND id=$3`,
        ["sold", +id, +propertyid]
      );

      return result;
    } catch (error: any) {
      return {
        error: {
          status: 500,
          message: "Unable to insert data into the property  table",
          error: error.message,
        },
      };
    }
  }

  static async cursor(propertyid: string) {
    try {
      const property = await pool.query(`SELECT * FROM property WHERE id=$1`, [
        +propertyid,
      ]);
      return property;
    } catch (error: any) {
      return {
        error: {
          status: 500,
          message: "Unable to insert data into the property  table",
          error: error.message,
        },
      };
    }
  }

  static async update(values: string[]) {
    try {
      const result = await pool.query(
        `UPDATE property SET price=$1, state=$2, city=$3, address=$4, type=$5, image_url=$6 WHERE id=$7 AND owner=$8`,
        values
      );

      return result;
    } catch (error: any) {
      return {
        error: {
          status: 500,
          message: "Unable to insert data into the property  table",
          error: error.message,
        },
      };
    }
  }
}

export default propertyQueries;
