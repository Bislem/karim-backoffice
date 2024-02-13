import { Attachments } from "./Attachments";

export interface Service {
    id: number;
    name: string;
    cover: string;
    icon: string;
    data: Data[];
    pricing: Pricing[];
    publish: boolean;
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