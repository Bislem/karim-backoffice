import { Role } from "./Role";

export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role | null;
    token?: string;
}