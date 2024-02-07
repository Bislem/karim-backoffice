import { Attachments } from "./Attachments";

export interface Service {
    id: number;
    name: string;
    image: string;
    data: Data[];
    pricing: Pricing[];
}


export class Data {
    label: string;
    value: string;
}
export class Pricing {
    price: number;
    name: string;
    cta: string;//url
    data: Data[];
}