import BotInterface from "../types/BotInterface";
import conn from "../db/conn";

export default class Bot implements BotInterface {
  id?: number | undefined;
  name: string;
  userName: string;
  link: string;
  token: string;
  providerId: number;

  constructor({ name, userName, link, token, providerId }: BotInterface) {
    this.name = name;
    this.userName = userName;
    this.link = link;
    this.token = token;
    this.providerId = providerId;
  }

  async insert() {
    const sql =
      "INSERT INTO Bots (name, userName, link, token, providerId) VALUES (?, ?, ?, ?, ?)";
    const values = [
      this.name,
      this.userName,
      this.link,
      this.token,
      this.providerId,
    ];

    conn.query(sql, values, (err) => {
      if (err) {
        throw new Error(err.message);
      }
    });
  }

  static async getByUsername(userName: string): Promise<Bot | null> {
    const sql = "SELECT * FROM Bots WHERE userName = ?";

    return new Promise((resolve, reject) => {
      conn.query(sql, [userName], (err, results) => {
        if (err) {
          return reject(new Error(err.message));
        }

        if (results.length > 0) {
          const botData = results[0];
          const bot = new Bot({
            id: botData.id,
            name: botData.name,
            userName: botData.userName,
            link: botData.link,
            token: botData.token,
            providerId: botData.providerId,
          });
          resolve(bot);
        } else {
          resolve(null);
        }
      });
    });
  }

  static async getById(id: number): Promise<Bot | null> {
    const sql = "SELECT * FROM Bots WHERE id = ?";

    return new Promise((resolve, reject) => {
      conn.query(sql, [id], (err, results) => {
        if (err) {
          return reject(new Error(err.message));
        }

        if (results.length > 0) {
          const botData = results[0];
          const bot = new Bot({
            id: botData.id,
            name: botData.name,
            userName: botData.userName,
            link: botData.link,
            token: botData.token,
            providerId: botData.providerId,
          });
          resolve(bot);
        } else {
          resolve(null);
        }
      });
    });
  }
}
