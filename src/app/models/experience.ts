export class iExperience {
    public workshopKey: string;
    public uid: string;
    public isDraft: boolean = false;
    public isFeatured: boolean = false;
    public timestamp: number;
    public experienceTitle: string;
    public experienceDescription: string;
    public experienceType: string = 'physical';
    public experienceCategory: string = 'workshop';
    public theme: string;
    public tags: string[] = [];
    public accessibility: string = 'everybody';
    public guestLearners: number = 1;
    public canLearnerBookAsGroup: boolean = false;
    public maximumBookableGroupByLearner: number = 1;
    public targetAudience: string;
    public targetGroups: string[] = [];
    public requiredLevelOfExpertise: string;
    public requiredskillset: string[] = [];
    public mainLanguage: string;
    public otherLanguages: string[] = [];
    public ratePerLearner: number;
    public ratePerMember: number;
    public learningOutcomes: string;
    public instructions: string;
    public isMaterialsProvided: boolean = false;
    public isBringlistRequired: boolean = false;
    public isLocationFromHub: boolean;
    public bringList: string[] = [];
    public materials: string[] = [];
    public coverImage: string;
    public additionalPhotos: string[] = [];
    public avgRating: number;
    public totalReviews: number;
    public sessions: iExperienceSession[] = [];
    public experienceDuration: iExperienceDuration = new iExperienceDuration();
    public location: iExperienceLocation = new iExperienceLocation();
    public bookedBy: string[] = [];
}

export class iExperienceSession {
    public topic: string;
    public date: string;
    public startTime: string;
    public endTime: string;
    public description: string;
}

export class iExperienceDuration {
    public startDate: string;
    public startTime: string;
    public hourlyDuration: number;
    public minutesDuration: number;
    public isRecurring: boolean;
    public recurringPeriod: string;
    public endDate: string;
}

export class iExperienceLocation {
    public location: string;
    public country: string;
    public state: string;
    public city: string;
    public postcode: string;
    public lat: number;
    public lng: number;
    public streetAddress: string;
}