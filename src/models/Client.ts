import conn from "../db/conn";
import ClientInterface from "../types/ClientInterface";

export default class Client implements ClientInterface {
  id: number;
  name: string;
  username: string;

  constructor({ id, name, username }: ClientInterface) {
    this.id = id;
    this.name = name;
    this.username = username;
  }

  async insert() {
    const sql = `INSERT INTO Clients (id,name,username) VALUES ('${this.id}','${this.name}','${this.username}')`;
    conn.query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
    });
  }
}
