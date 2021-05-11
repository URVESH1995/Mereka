import { iUser } from "./user";
import { iPostJob } from "./post-job";

export class iJobBid {
    public jobKey: string;
    public uid: string;
    public type: string = 'fixed';
    public coverLetter: string;
    public jobOwner: string;
    public timestamp: number = Number(new Date());
    public fixedPrice: number;
    public totalPrice: number = 0;
    public answers: iJobAnswers[] = [];
    public milestones: iJobMilestone[] = [];
    public status: string;
    public bidPerson: iUser;
    public jobDetails: iPostJob;
    public key: string;
    public ownerProfile: iUser;
    public transactionKey: string;
    public completionDate: number
}

export class iJobMilestone {
    public name: string;
    public price: number;
    public delivery: number;
    public status: string;
}

export class iJobAnswers {
    public question: string;
    public answer: string;
}