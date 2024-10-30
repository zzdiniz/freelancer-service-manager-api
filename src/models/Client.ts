import conn from "../db/conn";
import ClientInterface from "../types/ClientInterface";
import Conversation from "../types/Conversation";

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

  static async getById(id: number): Promise<ClientInterface | null> {
    const sql = "SELECT * FROM Clients WHERE id = ?";

    return new Promise((resolve, reject) => {
      conn.query(sql, [id], (err, results) => {
        if (err) {
          return reject(new Error(err.message));
        }

        if (Array.isArray(results) && results.length > 0) {
          const client = results[0] as ClientInterface;
          resolve(client);
        } else {
          resolve(null);
        }
      });
    });
  }

  static async createConversation({
    providerId,
    clientId,
    conversationState,
  }: Conversation) {
    const sql = `INSERT INTO Conversations (providerId, clientId, conversationState) VALUES (?, ?, ?)`;
    const params = [providerId, clientId, conversationState];

    return new Promise<void>((resolve, reject) => {
      conn.query(sql, params, (err) => {
        if (err) {
          return reject(new Error(err.message));
        }
        resolve();
      });
    });
  }

  static async updateConversation({
    providerId,
    clientId,
    conversationState,
  }: Conversation) {
    const sql = `UPDATE Conversations SET conversationState = ? WHERE providerId = ? AND clientId = ?`;
    const params = [conversationState, providerId, clientId];

    return new Promise<void>((resolve, reject) => {
      conn.query(sql, params, (err) => {
        if (err) {
          return reject(new Error(err.message));
        }
        resolve();
      });
    });
  }

  static async getConversation(providerId: number,clientId: number): Promise<Conversation | null> {
    const sql = "SELECT * FROM Conversations WHERE providerId = ? AND clientId = ?";

    return new Promise((resolve, reject) => {
      conn.query(sql, [providerId,clientId], (err, results) => {
        if (err) {
          return reject(new Error(err.message));
        }

        if (Array.isArray(results) &&  results.length > 0) {
          const conversation = results[0] as Conversation;
          resolve(conversation);
        } else {
          resolve(null);
        }
      });
    });
  }
}
