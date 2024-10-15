export default interface AppointmentInterface{
    id?: number;
    datetime: string;
    status: 'done' | 'canceled' | 'scheduled' | 'unavailable';
    providerId: number;
    serviceId?: number;
    clientId?: number;
    review?: 0 | 1 | 2 | 3 | 4 | 5;
}