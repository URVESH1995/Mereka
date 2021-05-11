export class iUser {
    public fullName: string;
    public email: string;
    public referralCode: string;
    public dob: string;
    public isExpert: boolean;
    public profileUrl: string;
    public phone: string;
    public uid: string;
    public timestamp: number;
    public completedJobs: number;
    public rating: number;
    public agencyId: string;
    public reviewsCount: number;
    public myAgency: string;
    public businessRegID: string;
    public passwordUpdatedOn: number;
    public favWorkshops: string[] = [];
    public favHubs: string[] = [];
    public favExperts: string[] = [];
    public location: iUserLocation = new iUserLocation();
    public expertProfile: iExpertProfile = new iExpertProfile();
    public learnerProfile: iLearnerProfile = new iLearnerProfile();
}

export class iUserLocation {
    public location: string;
    public country: string;
    public state: string;
    public city: string;
    public postcode: string;
    public lat: number;
    public lng: number;
    public streetAddress: string;
}

export class iExpertProfile {
    public skills: string[] = [];
    public expertise: iExpertise;
    public languages: string[];
    public otherLanguages: string[];
    public portfolio: iPortfolio[];
    public hourlyRate: iHourlyRate;
    public overview: iOverview;
}

export class iExpertise {
    public title: string;
    public skillTypes: string[] = [];
    public skills: string[] = [];
}

export class iPortfolio {
    public title: string;
    public attachedFiles: any[] = [];
    public skills: string[] = [];
    public description: string;
    public startYear: string;
    public endYear: string;
    public projectLink: string;
}

export class iHourlyRate {
    public hourlyRate: number;
    public marekaFee: number;
    public expertHourlyRate: number;
}

export class iOverview {
    public title: string;
    public overview: string;
}

export class iLearnerProfile {
    public purposeInExperiences: string[] = [];
    public interestedExperiences: string[] = [];
    public interestedThemes: string[] = [];
    public purposeInSpaces: string[] = [];
    public interestedSpaces: string[] = [];
    public interestedInMachines: boolean;
    public interestedExperts: string[] = [];
    public coverImage: string;
    public webUrl: string;
    public fbUrl: string;
    public linkedinUrl: string;
    public instaUrl: string;
    public aboutMe: string;
    public educationList: iEducation[] = [];
    public employmentList: iEmployment[] = [];
    public language: string;
    public otherLanguages: string[];
    public uid: string;
}

export class iEducation {
    public school: string;
    public areaOfStudy: string;
    public qualifications: string;
    public startDate: string;
    public endDate: string;
    public description: string;
}

export class iEmployment {
    public company: string;
    public location: string;
    public country: string;
    public role: string;
    public startDate: string;
    public endDate: string;
    public currentlyWorking: boolean;
    public description: string;
}