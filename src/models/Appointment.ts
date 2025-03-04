import conn from "../db/conn";
import AppointmentInterface from "../types/AppointmentInterface";

export default class Appointment implements AppointmentInterface {
  id?: number;
  datetime: string;
  status: "done" | "canceled" | "scheduled" | "unavailable";
  providerId: number;
  serviceId?: number;
  clientId?: number;

  constructor({
    datetime,
    status,
    providerId,
    serviceId,
    clientId,
  }: AppointmentInterface) {
    this.datetime = datetime;
    this.status = status;
    this.providerId = providerId;
    this.serviceId = serviceId;
    this.clientId = clientId;
  }

  async insert() {
    const sql =
      "INSERT INTO Appointments (datetime, status, providerId, serviceId, clientId) VALUES (?, ?, ?, ?, ?)";
    const values = [
      this.datetime,
      this.status,
      this.providerId,
      this.serviceId,
      this.clientId,
    ];

    conn.query(sql, values, (err) => {
      if (err) {
        throw new Error(err.message);
      }
    });
  }

  static async getByProviderId(
    providerId: number
  ): Promise<AppointmentInterface[] | null> {
    const sql = "SELECT * FROM Appointments WHERE providerId = ?";

    return new Promise((resolve, reject) => {
      conn.query(sql, [providerId], (err, results) => {
        if (err) {
          return reject(new Error(err.message));
        }

        // Verifique se 'results' é um array para garantir que seja o tipo esperado
        if (Array.isArray(results) && results.length > 0) {
          resolve(results as AppointmentInterface[]);
        } else {
          resolve(null);
        }
      });
    });
  }

  static async getFinished(
    providerId: number
  ): Promise<AppointmentInterface[] | null> {
    const sql =
      "SELECT * FROM Appointments WHERE providerId = ? AND status = 'done'";

    return new Promise((resolve, reject) => {
      conn.query(sql, [providerId], (err, results) => {
        if (err) {
          return reject(new Error(err.message));
        }

        if (Array.isArray(results) && results.length > 0) {
          resolve(results as AppointmentInterface[]);
        } else {
          resolve(null);
        }
      });
    });
  }

  static async getById(id: number): Promise<AppointmentInterface | null> {
    const sql = "SELECT * FROM Appointments WHERE id = ?";

    return new Promise((resolve, reject) => {
      conn.query(sql, [id], (err, results) => {
        if (err) {
          return reject(new Error(err.message));
        }

        if (Array.isArray(results) && results.length > 0) {
          resolve(results[0] as AppointmentInterface);
        } else {
          resolve(null);
        }
      });
    });
  }

  static async getBusyDates(
    providerId: number
  ): Promise<AppointmentInterface[] | null> {
    const sql =
      "SELECT * FROM Appointments WHERE providerId = ? AND status != 'canceled'";

    return new Promise((resolve, reject) => {
      conn.query(sql, [providerId], (err, results) => {
        if (err) {
          return reject(new Error(err.message));
        }

        if (Array.isArray(results) && results.length > 0) {
          resolve(results as AppointmentInterface[]);
        } else {
          resolve(null);
        }
      });
    });
  }

  static async updateStatus(id: number, status: string) {
    const sql = `UPDATE Appointments SET status = ? WHERE id = ?`;
    const params = [status, id];

    return new Promise<void>((resolve, reject) => {
      conn.query(sql, params, (err) => {
        if (err) {
          return reject(new Error(err.message));
        }
        resolve();
      });
    });
  }

  static async setDone(providerId: number, datetime: string) {
    const sql = `UPDATE Appointments SET status = 'done' WHERE providerId = ? AND status = 'scheduled' AND datetime < ?`;
    const params = [providerId, datetime];

    return new Promise<void>((resolve, reject) => {
      conn.query(sql, params, (err) => {
        if (err) {
          return reject(new Error(err.message));
        }
        resolve();
      });
    });
  }

  static async getAlmostDone(
    providerId: number,
    datetime: string
  ): Promise<AppointmentInterface[] | null> {
    const sql = `SELECT * FROM Appointments WHERE providerId = ? AND status = 'scheduled' AND datetime < ?`;
    return new Promise((resolve, reject) => {
      conn.query(sql, [providerId, datetime], (err, results) => {
        if (err) {
          return reject(new Error(err.message));
        }

        if (Array.isArray(results) && results.length > 0) {
          resolve(results as AppointmentInterface[]);
        } else {
          resolve(null);
        }
      });
    });
  }

  static async getLatest(
    providerId: number,
    clientId: number
  ): Promise<AppointmentInterface | null> {
    const sql =
      "SELECT * FROM Appointments WHERE (providerId = ? AND clientId = ?) AND status != 'done' ORDER BY datetime DESC LIMIT 1";

    return new Promise((resolve, reject) => {
      conn.query(sql, [providerId, clientId], (err, results) => {
        if (err) {
          return reject(new Error(err.message));
        }

        if (Array.isArray(results) && results.length > 0) {
          resolve(results[0] as AppointmentInterface);
        } else {
          resolve(null);
        }
      });
    });
  }

  static async addReview(id: number, review: string) {
    const sql = `UPDATE Appointments SET review = ? WHERE id = ?`;
    const params = [review, id];

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
