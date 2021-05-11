import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HireExpertComponent } from './hire-expert/hire-expert.component';
import { FindExpertComponent } from './find-expert/find-expert.component';
import { ExpertProfileComponent } from './expert-profile/expert-profile.component';
import { FindJobsComponent } from './find-jobs/find-jobs.component';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { ChatsComponent } from './chats/chats.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PostJobComponent } from './post-job/post-job.component';
import { PostJobStep2Component } from './post-job-step2/post-job-step2.component';
import { PostJobStep3Component } from './post-job-step3/post-job-step3.component';
import { PostJobStep4Component } from './post-job-step4/post-job-step4.component';
import { SpacesComponent } from './spaces/spaces.component';
import { SpaceAvailabilityComponent } from './space-availability/space-availability.component';
import { SpaceDateTimeComponent } from './space-date-time/space-date-time.component';
import { PaymentComponent } from './payment/payment.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { ActiveJobDetailComponent } from './active-job-detail/active-job-detail.component';
import { WorkshopsComponent } from './workshops/workshops.component';
import { WorkshopDetailComponent } from './workshop-detail/workshop-detail.component';
import { MerekaProComponent } from './mereka-pro/mereka-pro.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { GeneralProfileComponent } from './general-profile/general-profile.component';
import { MyWorkshopsComponent } from './my-workshops/my-workshops.component';
import { AppDataComponent } from './app-data/app-data.component';
import { JobMilestonesComponent } from './job-milestones/job-milestones.component';
import { AddHubComponent } from './hub/add-hub/add-hub.component';
import { HubBasicDetailsComponent } from './hub/hub-basic-details/hub-basic-details.component';
import { HubDashboardComponent } from './hub/hub-dashboard/hub-dashboard.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { ExpertiseDetailsComponent } from './expert/expertise-details/expertise-details.component';
import { ExpertOverviewComponent } from './expert/expert-overview/expert-overview.component';
import { ExpertPortfoliosComponent } from './expert/expert-portfolios/expert-portfolios.component';
import { ExpertProfileConfirmationComponent } from './expert/expert-profile-confirmation/expert-profile-confirmation.component';
import { CreateWorkshopComponent } from './create-workshop/create-workshop.component';
import { WorkshopAdditionalInfoComponent } from './create-workshop/workshop-additional-info/workshop-additional-info.component';
import { WorkshopAudienceComponent } from './create-workshop/workshop-audience/workshop-audience.component';
import { WorkshopBasicDetailsComponent } from './create-workshop/workshop-basic-details/workshop-basic-details.component';
import { WorkshopPreviewComponent } from './create-workshop/workshop-preview/workshop-preview.component';
import { WorkshopPaymentComponent } from './workshop-payment/workshop-payment.component';
import { MyWorkshopBookingsComponent } from './my-workshop-bookings/my-workshop-bookings.component';
import { LearnerProfileComponent } from './learner-profile/learner-profile.component';
import { AgencyProfileComponent } from './agency-profile/agency-profile.component';
import { CreateLearnerProfileComponent } from './create-learner-profile/create-learner-profile.component';
import { SetupLearnerProfileComponent } from './create-learner-profile/setup-learner-profile/setup-learner-profile.component';
import { LearnerConfirmationComponent } from './create-learner-profile/learner-confirmation/learner-confirmation.component';
import { LearnerDashboardComponent } from './learner-dashboard/learner-dashboard.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'hire-expert', component: HireExpertComponent },
  { path: 'find-expert/:selectedSkill', component: FindExpertComponent },
  { path: 'find-expert', component: FindExpertComponent },
  { path: 'expert-profile/:uid', component: ExpertProfileComponent },
  { path: 'find-jobs/:searchQuery', component: FindJobsComponent },
  { path: 'find-jobs', component: FindJobsComponent },
  { path: 'job-detail/:key', component: JobDetailComponent },
  { path: 'chats', component: ChatsComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'post-job', component: PostJobComponent },
  { path: 'post-job-step2', component: PostJobStep2Component },
  { path: 'post-job-step3', component: PostJobStep3Component },
  { path: 'post-job-step4', component: PostJobStep4Component },
  { path: 'spaces', component: SpacesComponent },
  { path: 'space-availability', component: SpaceAvailabilityComponent },
  { path: 'space-date-time/:key', component: SpaceDateTimeComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'my-orders', component: MyOrdersComponent },
  { path: 'my-orders/:tab', component: MyOrdersComponent },
  { path: 'post-details/:key', component: PostDetailComponent },
  { path: 'active-job-detail/:key', component: ActiveJobDetailComponent },
  { path: 'workshops', component: WorkshopsComponent },
  { path: 'workshop-details/:key', component: WorkshopDetailComponent },
  { path: 'my-workshops', component: MyWorkshopsComponent },
  { path: 'mereka-pro', component: MerekaProComponent },
  { path: 'favourites', component: FavouritesComponent },
  { path: 'general-profile', component: GeneralProfileComponent },
  { path: 'app-data/:key', component: AppDataComponent },
  { path: 'job-milestones', component: JobMilestonesComponent },
  { path: 'add-hub', component: AddHubComponent },
  { path: 'hub-basic-details', component: HubBasicDetailsComponent },
  { path: 'hub-dashboard', component: HubDashboardComponent },
  { path: 'add-service', component: AddServiceComponent },
  { path: 'expertise-details', component: ExpertiseDetailsComponent },
  { path: 'expert-overview', component: ExpertOverviewComponent },
  { path: 'expert-portfolios', component: ExpertPortfoliosComponent },
  { path: 'expert-profile-confirmation', component: ExpertProfileConfirmationComponent },
  { path: 'create-workshop', component: CreateWorkshopComponent },
  { path: 'workshop-audience', component: WorkshopAudienceComponent },
  { path: 'workshop-additional-info', component: WorkshopAdditionalInfoComponent },
  { path: 'workshop-basic-details', component: WorkshopBasicDetailsComponent },
  { path: 'workshop-preview', component: WorkshopPreviewComponent },
  { path: 'workshop-payment', component: WorkshopPaymentComponent },
  { path: 'my-workshop-bookings', component: MyWorkshopBookingsComponent },
  { path: 'learner-profile', component: LearnerProfileComponent },
  { path: 'agency-profile/:hubId', component: AgencyProfileComponent },
  { path: 'create-learner-profile', component: CreateLearnerProfileComponent },
  { path: 'setup-learner-profile', component: SetupLearnerProfileComponent },
  { path: 'learner-dashboard', component: LearnerDashboardComponent },
  { path: 'learner-confirmation', component: LearnerConfirmationComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
