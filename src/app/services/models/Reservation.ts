import { Product } from "./Service";
import { User } from "./User";

export interface Reservation {
    id?: string;
    userId: string;
    projectName: string;
    description: string;
    place: string;
    total: number;//prix
    user?: User;//get
    startDate: number;
    endDate: number;
    createdAt?: number;
    status: 'pending' | 'canceled' | 'finished' | 'accepted';
    returnDate?: number;
    products: Product[];
}
