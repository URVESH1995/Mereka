import { iUser } from "./user";

export class iExperienceReview {
    public workshopKey: string;
    public uid: string;
    public workshopOwner: string;
    public timestamp: number;
    public review: string;
    public rating: number;
    public ratingUser: iUser;
    public key: string;
}