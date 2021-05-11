import { iUser } from "./user";
import { iPostJob } from "./post-job";
import { iAgency } from "./agency";

export class iChatNode {
    public chatKey: string;
    public messages: any = {};
    public lastMessage: string;
    public lastMessageTimestamp: number;
    public deletedBy: any = {};
    public agencyId: string;
    public clientId: string;
    public expertId: string;
    public jobKey: string;

    public clientDetails: iUser = new iUser();
    public jobDetails: iPostJob = new iPostJob();
    public expertDetails: iUser = new iUser();
    public agencyDetails: iAgency = new iAgency();
}