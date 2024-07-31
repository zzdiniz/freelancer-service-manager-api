import conn from "../db/conn";
import ProviderInterface from "../types/ProviderInterface";

class Provider implements ProviderInterface {
  id?: number;
  name: string;
  email: string;
  password: string;

  constructor({ name, email, password }: ProviderInterface) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  async insert() {
    const sql = `INSERT INTO Providers (name,email,password) VALUES ('${this.name}','${this.email}','${this.password}')`;
    conn.query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
    });
  }

  public static async getByEmail(
    email: string
  ): Promise<ProviderInterface | undefined> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Providers WHERE email='${email}'`;
      conn.query(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.length > 0 ? data[0] : undefined);
        }
      });
    });
  }

  public static async getById(
    id: number
  ): Promise<ProviderInterface | undefined> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Providers WHERE id='${id}'`;
      conn.query(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.length > 0 ? data[0] : undefined);
        }
      });
    });
  }
}

export default Provider;
