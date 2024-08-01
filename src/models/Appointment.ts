import AppointmentInterface from "../types/AppointmentInterface";

export default class Appointment implements AppointmentInterface{
    id?: number;
    datetime: string;
    status: "done" | "canceled" | "scheduled";
    providerId: number;
    serviceId: number;
    clientId: number;

    constructor({datetime,status,providerId,serviceId,clientId}:AppointmentInterface){
        this.datetime = datetime;
        this.status = status;
        this.providerId = providerId;
        this.serviceId = serviceId;
        this.clientId = clientId
    }
}