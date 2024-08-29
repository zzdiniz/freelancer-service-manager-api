export interface MessageRequest{
    id?: number;
    providerId: number;
    clientId: number;
    message: string;
    status: 'pending_response' | 'responded';
}