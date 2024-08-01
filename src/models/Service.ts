import conn from "../db/conn";
import ServiceInterface from "../types/ServiceInterface";

export default class Service implements ServiceInterface {
  id?: number;
  name: string;
  description: string;
  price: number;
  providerId: number;
  faq?: {
    question: string;
    response: string;
  }[];

  constructor({ name, description, price, providerId, faq }: ServiceInterface) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.providerId = providerId;
    this.faq = faq;
  }

  public static async addService({
    name,
    description,
    price,
    providerId,
    faq,
  }: Service) {
    const sql = `INSERT INTO Services (name, description, price, providerId, faq) VALUES (?, ?, ?, ?, ?)`;
    const faqJSON = faq ? JSON.stringify(faq) : null;
    conn.query(sql, [name, description, price, providerId, faqJSON], (err) => {
      if (err) {
        throw new Error(err.message);
      }
    });
  }

  public static async getByProviderId(
    id: number
  ): Promise<ServiceInterface[] | undefined> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Services WHERE providerId='${id}'`;
      conn.query(query, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.length > 0 ? data : undefined);
        }
      });
    });
  }

  public static async getByServiceId(
    id: number
  ): Promise<ServiceInterface | undefined> {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Services WHERE id='${id}'`;
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
