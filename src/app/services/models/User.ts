import { Role } from "./Role";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role | null;
    token?: string;
}