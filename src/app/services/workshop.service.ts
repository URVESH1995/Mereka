import { Injectable } from '@angular/core';
import { iExperience } from '../models/experience';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {

  constructor() { }

  allFieldsAreFilled(workshopObj: iExperience): boolean {
    let dataFilled: boolean = true;
    if (!workshopObj.theme || !workshopObj.tags.length || !workshopObj.location.city || !workshopObj.location.country ||
      !workshopObj.location.state || !workshopObj.location.streetAddress ||
      !workshopObj.location.location || !workshopObj.location.postcode ||
      !workshopObj.location.lat || !workshopObj.location.lng || !workshopObj.targetAudience ||
      (workshopObj.targetAudience === 'Specific Groups' && !workshopObj.targetGroups.length) ||
      !workshopObj.requiredLevelOfExpertise || ((workshopObj.requiredLevelOfExpertise === 'Intermediate'
        || workshopObj.requiredLevelOfExpertise === 'Advanced') && !workshopObj.requiredskillset.length) ||
      !workshopObj.mainLanguage || (!workshopObj.experienceDuration.hourlyDuration &&
        !workshopObj.experienceDuration.minutesDuration) || !workshopObj.experienceDuration.startDate ||
      !workshopObj.experienceDuration.startTime || (workshopObj.experienceDuration.isRecurring &&
        !workshopObj.experienceDuration.recurringPeriod) || !this.isPriceDefined(workshopObj) ||
      !workshopObj.sessions.length || !workshopObj.experienceTitle ||
      !workshopObj.experienceDescription || !workshopObj.coverImage || workshopObj.additionalPhotos.length < 4
      || !workshopObj.learningOutcomes || !workshopObj.instructions ||
      (workshopObj.isMaterialsProvided && !workshopObj.materials.length) ||
      (workshopObj.isBringlistRequired && !workshopObj.bringList.length)
    ) {
      dataFilled = false;
    }
    return dataFilled;
  }

  isPriceDefined(workshopObj: iExperience): boolean {
    let priceSet: boolean = true;
    if ((workshopObj.accessibility === 'everybody') && !workshopObj.ratePerLearner) {
      priceSet = false;
    }
    if ((workshopObj.accessibility === 'members' || workshopObj.accessibility === 'everybody')
      && !workshopObj.ratePerMember) {
      priceSet = false;
    }
    return priceSet;
  }

}
