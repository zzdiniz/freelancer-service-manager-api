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
    const sql = 'INSERT INTO Bots (name, userName, link, token, providerId) VALUES (?, ?, ?, ?, ?)';
    const values = [this.name, this.userName, this.link, this.token, this.providerId];

    conn.query(sql, values, (err) => {
      if (err) {
        throw new Error(err.message);
      }
    });
  }
}
