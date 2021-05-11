export class iExperienceFilters {
    public type: string = 'online';
    public location: string;
    public date: string;
    public lat: number;
    public lng: number;
    public skillsets: string[] = [];
    public category: string;
    public languages: string[] = [];
    public accessibility: string = 'everybody';
    public tag: string = 'All tags';
    public moreFilters: iMoreFilters = new iMoreFilters();
}

export class iMoreFilters {
    public numberOfLearners: number = 0;
    public groups: string[] = [];
}