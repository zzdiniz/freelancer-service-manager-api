import conn from "../db/conn";
import ClientInterface, { ConversationState } from "../types/ClientInterface";

export default class Client implements ClientInterface {
  id: number;
  name: string;
  username: string;
  conversationState?: ConversationState;

  constructor({ id, name, username, conversationState }: ClientInterface) {
    this.id = id;
    this.name = name;
    this.username = username;
  }

  async insert() {
    const sql = `INSERT INTO Clients (id,name,username,conversationState) VALUES ('${this.id}','${this.name}','${this.username}','${this.conversationState}')`;
    conn.query(sql, (err) => {
      if (err) {
        throw new Error(err.message);
      }
    });
  }

  static async getById(id: number): Promise<ClientInterface| null> {
    const sql = "SELECT * FROM Clients WHERE id = ?";

    return new Promise((resolve, reject) => {
      conn.query(sql, [id], (err, results) => {
        if (err) {
          return reject(new Error(err.message));
        }

        if (results.length > 0) {
          const client = results[0];
          resolve(client);
        } else {
          resolve(null);
        }
      });
    });
  }

  static async update({id,name,username,conversationState}:ClientInterface) {
    const sql = `UPDATE Clients SET name = ?, username = ?, conversationState = ? WHERE id = ?`;
    const params = [name, username, conversationState, id];

    return new Promise<void>((resolve, reject) => {
      conn.query(sql, params, (err) => {
        if (err) {
          return reject(new Error(err.message));
        }
        resolve();
      });
    });
  }
}
