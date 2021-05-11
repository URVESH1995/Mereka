import { iUser } from "./user";

export class iAgency {
    public agencyName: string;
    public agencyLogo: string;
    public agencyDescription: string;
    public timestamp: number;
    public expertUid: string;
    public packageInfo: string;
    public packagePrice: number;
    public webUrl: string;
    public fbUrl: string;
    public linkedinUrl: string;
    public instaUrl: string;
    public coverImage: string;
    public companyType: string;
    public location: iAgencyLocation = new iAgencyLocation();
    public canLearnerSendJobRequests: boolean;
    public canLearnerRequestInstantQuotes: boolean;
    public amenities: string[] = [];
    public facilities: string[] = [];
    public experts: iAgencyExperts[] = [];
    public expertsInvitations: string[] = [];
    public memberRequests: string[] = [];
    public agencyMembers: iAgencyMembers[] = [];
    public totalReviews: number;
    public avgRating: number;
    public isApproved: boolean;
    public bankDetails: iAgencyBank = new iAgencyBank();
}

export class iAgencyLocation {
    public location: string;
    public country: string;
    public state: string;
    public city: string;
    public postcode: string;
    public lat: number;
    public lng: number;
    public streetAddress: string;
}

export class iAgencyExperts {
    public uid: string;
    public role: string;
    public profile?: iUser;
    public inviteDate: number;
    public isSelected?: boolean;
}

export class iAgencyMembers {
    public uid: string;
    public profile: iUser;
    public joinDate: number;
}

export class iAgencyBank {
    public country: string;
    public bankName: string;
    public accountNumber: string;
    public dateAdded: number;
}

export class iWithdrawal {
    public agencyId: string;
    public withdrawAmount: number;
    public status: string;
    public timestamp: number;
    public description: string;
    public key: string;
}