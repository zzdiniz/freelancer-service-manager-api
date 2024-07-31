export default interface ServiceInterface {
    id?:number;
    name: string;
    description: string;
    price: number;
    providerId: number;
    faq?:{
        question: string;
        response: string;
    }[]
}