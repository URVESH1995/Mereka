import { iExperienceSession, iExperience } from "./experience";

export class iBookExperience {
    public workshopKey: string;
    public key: string;
    public owner: string;
    public bookedBy: string;
    public bookedAs: string;
    public timestamp: number;
    public price: number;
    public learners: number;
    public transactionKey: string;
    public session: iExperienceSession;
    public workshopDetails: iExperience;
    public learnersDetails: iBookedLearner[] = [];
}

export class iBookedLearner {
    public name: string;
    public email: string;
}