import { Role } from "./Role";

export class User {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    role: Role | null;
    documentId?: string;
}