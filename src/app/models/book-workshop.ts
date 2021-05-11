import { iExperience } from "./experience";

export class iBookWorkshop {
    public workshopKey: string;
    public key: string;
    public owner: string;
    public workshopDetails: iExperience;
    public bookedBy: string;
    public bookedAs: string;
    public timestamp: number;
    public price: number;
    public quantity: number;
    public transactionKey: string;
}