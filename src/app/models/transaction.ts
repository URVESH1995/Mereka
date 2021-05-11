export class iTransaction {
    public paymentForAcceptJobProposal: boolean = false;
    public paymentForBookingWorkshop: boolean = false;
    public transactionKey: string;
    public paymentFrom: string;
    public workshopKey: string;
    public jobKey: string;
    public paymentRef: any;
    public timestamp: number;
    public amount: number;
    public hubId: string;
}