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
}
