import { Attachments } from "./Attachments";

export interface Product {
    id: number;
    name: string;
    description: string;
    ref: string;
    category: string;
    allowedLevel: number; //small number (1,2,3)
    place: string;
    price: number;
    isExternal: boolean;
    quantity: number;
    created_at: number;//date
    update_at: number; //date
    boughtOn: number; //date 
    quantityPurchased: number;//quantite original
    images: Attachments[] | string;//json
}