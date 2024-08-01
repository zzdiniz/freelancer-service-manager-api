export default interface AppointmentInterface{
    id?: number;
    datetime: string;
    status: 'done' | 'canceled' | 'scheduled'
    providerId: number;
    serviceId: number;
    clientId: number;
}