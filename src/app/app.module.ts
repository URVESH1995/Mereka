import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
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
import { ReviewProposalsComponent } from './review-proposals/review-proposals.component';
import { ActiveJobsComponent } from './active-jobs/active-jobs.component';
import { ActiveJobDetailComponent } from './active-job-detail/active-job-detail.component';
import { WorkshopsComponent } from './workshops/workshops.component';
import { WorkshopDetailComponent } from './workshop-detail/workshop-detail.component';
import { MerekaProComponent } from './mereka-pro/mereka-pro.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule, ToastNoAnimationModule } from 'ngx-toastr';
import { NgxLoadingModule } from 'ngx-loading';
import * as firebase from 'firebase';
import { PostJobMenuComponent } from './components/post-job-menu/post-job-menu.component';
import { GeneralProfileComponent } from './general-profile/general-profile.component';
import { MyWorkshopsComponent } from './my-workshops/my-workshops.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatScreenComponent } from './components/chat-screen/chat-screen.component';
import { SearchPipe } from './search.pipe';
import { AgmCoreModule } from '@agm/core';
import { AppDataComponent } from './app-data/app-data.component';
import { NgxGeoautocompleteModule } from 'ngx-geoautocomplete';
import { JobMilestonesComponent } from './job-milestones/job-milestones.component';
import { PaymentCardComponent } from './components/payment-card/payment-card.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NavbarFiltersComponent } from './components/navbar-filters/navbar-filters.component';
import { PreSignupComponent } from './components/pre-signup/pre-signup.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { SignupModalComponent } from './components/signup-modal/signup-modal.component';
import { PreLoginComponent } from './components/pre-login/pre-login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HubBasicDetailsComponent } from './hub/hub-basic-details/hub-basic-details.component';
import { HubProfileDetailsComponent } from './hub/hub-profile-details/hub-profile-details.component';
import { HubProfileConfirmationComponent } from './hub/hub-profile-confirmation/hub-profile-confirmation.component';
import { HubDashboardComponent } from './hub/hub-dashboard/hub-dashboard.component';
import { AboutHubComponent } from './hub/about-hub/about-hub.component';
import { AddHubComponent } from './hub/add-hub/add-hub.component';
import { HubProfileSetupComponent } from './hub/hub-profile-setup/hub-profile-setup.component';
import { ExpertiseDetailsComponent } from './expert/expertise-details/expertise-details.component';
import { ExpertPortfoliosComponent } from './expert/expert-portfolios/expert-portfolios.component';
import { ExpertProfileConfirmationComponent } from './expert/expert-profile-confirmation/expert-profile-confirmation.component';
import { AddServiceComponent } from './add-service/add-service.component';
import { ExpertOverviewComponent } from './expert/expert-overview/expert-overview.component';
import { PortfolioComponent } from './expert-profile/portfolio/portfolio.component';
import { JobsAccomplishedComponent } from './expert-profile/jobs-accomplished/jobs-accomplished.component';
import { ExpertServicesComponent } from './expert-profile/expert-services/expert-services.component';
import { ExpertGeneralProfileComponent } from './expert-profile/expert-general-profile/expert-general-profile.component';

import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateWorkshopComponent } from './create-workshop/create-workshop.component';
import { WorkshopAudienceComponent } from './create-workshop/workshop-audience/workshop-audience.component';
import { WorkshopAdditionalInfoComponent } from './create-workshop/workshop-additional-info/workshop-additional-info.component';
import { WorkshopBasicDetailsComponent } from './create-workshop/workshop-basic-details/workshop-basic-details.component';
import { WorkshopPreviewComponent } from './create-workshop/workshop-preview/workshop-preview.component';
import { WorkshopPaymentComponent } from './workshop-payment/workshop-payment.component';
import { MyWorkshopBookingsComponent } from './my-workshop-bookings/my-workshop-bookings.component';
import { WorkshopBookingComponent } from './components/workshop-booking/workshop-booking.component';
import { LearnerProfileComponent } from './learner-profile/learner-profile.component';
import { LearnerGeneralProfileComponent } from './learner-profile/learner-general-profile/learner-general-profile.component';
import { LearnerBackgroundComponent } from './learner-profile/learner-background/learner-background.component';
import { AgencyProfileComponent } from './agency-profile/agency-profile.component';
import { CreateLearnerProfileComponent } from './create-learner-profile/create-learner-profile.component';
import { SetupLearnerProfileComponent } from './create-learner-profile/setup-learner-profile/setup-learner-profile.component';
import { LearnerConfirmationComponent } from './create-learner-profile/learner-confirmation/learner-confirmation.component';
import { LearnerDashboardComponent } from './learner-dashboard/learner-dashboard.component';
import { MyMembershipsComponent } from './learner-dashboard/my-memberships/my-memberships.component';
import { LearnerNotifySettingsComponent } from './learner-dashboard/learner-notify-settings/learner-notify-settings.component';
import { LearnerBillingInfoComponent } from './learner-dashboard/learner-billing-info/learner-billing-info.component';
import { LearnerPrivacySettingsComponent } from './learner-dashboard/learner-privacy-settings/learner-privacy-settings.component';
import { LearnerSecuritySettingsComponent } from './learner-dashboard/learner-security-settings/learner-security-settings.component';
import { LearnerTransactionHistoryComponent } from './learner-dashboard/learner-transaction-history/learner-transaction-history.component';
import { HubExpertsComponent } from './hub/hub-dashboard/hub-experts/hub-experts.component';
import { HubMembersComponent } from './hub/hub-dashboard/hub-members/hub-members.component';
import { HubSecurityCenterComponent } from './hub/hub-dashboard/hub-security-center/hub-security-center.component';
import { HubBillingInformationComponent } from './hub/hub-dashboard/hub-billing-information/hub-billing-information.component';
import { HubExperiencesComponent } from './hub/hub-dashboard/hub-experiences/hub-experiences.component';
import { HubSpacesComponent } from './hub/hub-dashboard/hub-spaces/hub-spaces.component';
import { HubJobRequestsComponent } from './hub/hub-dashboard/hub-job-requests/hub-job-requests.component';
import { HubAnalyticsComponent } from './hub/hub-dashboard/hub-analytics/hub-analytics.component';
import { HubMessagesComponent } from './hub/hub-dashboard/hub-messages/hub-messages.component';
import { HubMachineQuotesComponent } from './hub/hub-dashboard/hub-machine-quotes/hub-machine-quotes.component';
import { InviteExpertsComponent } from './components/invite-experts/invite-experts.component';
import { CustomPaginationComponent } from './components/custom-pagination/custom-pagination.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';


var firebaseConfig = {
  apiKey: "AIzaSyBdCmrgsGG-pFNeoDnkVbhQplV1kXH0AqE",
  authDomain: "mereka-a4ae2.firebaseapp.com",
  databaseURL: "https://mereka-a4ae2.firebaseio.com",
  projectId: "mereka-a4ae2",
  storageBucket: "mereka-a4ae2.appspot.com",
  messagingSenderId: "494732246522",
  appId: "1:494732246522:web:20f33c6ca425096e563843",
  measurementId: "G-NVDS8R10RR"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    HireExpertComponent,
    FindExpertComponent,
    ExpertProfileComponent,
    FindJobsComponent,
    JobDetailComponent,
    ChatsComponent,
    NotificationsComponent,
    PostJobComponent,
    PostJobStep2Component,
    PostJobStep3Component,
    PostJobStep4Component,
    SpacesComponent,
    SpaceAvailabilityComponent,
    SpaceDateTimeComponent,
    PaymentComponent,
    ProfileComponent,
    DashboardComponent,
    MyOrdersComponent,
    PostDetailComponent,
    ReviewProposalsComponent,
    ActiveJobsComponent,
    ActiveJobDetailComponent,
    WorkshopsComponent,
    WorkshopDetailComponent,
    MerekaProComponent,
    FavouritesComponent,
    PostJobMenuComponent,
    GeneralProfileComponent,
    MyWorkshopsComponent,
    ChatScreenComponent,
    SearchPipe,
    AppDataComponent,
    JobMilestonesComponent,
    PaymentCardComponent,
    NavbarComponent,
    NavbarFiltersComponent,
    PreSignupComponent,
    LoginModalComponent,
    SignupModalComponent,
    PreLoginComponent,
    ResetPasswordComponent,
    HubBasicDetailsComponent,
    HubProfileDetailsComponent,
    HubProfileConfirmationComponent,
    HubDashboardComponent,
    AboutHubComponent,
    AddHubComponent,
    HubProfileSetupComponent,
    ExpertiseDetailsComponent,
    ExpertPortfoliosComponent,
    ExpertProfileConfirmationComponent,
    AddServiceComponent,
    ExpertOverviewComponent,
    PortfolioComponent,
    JobsAccomplishedComponent,
    ExpertServicesComponent,
    ExpertGeneralProfileComponent,
    CreateWorkshopComponent,
    WorkshopAudienceComponent,
    WorkshopAdditionalInfoComponent,
    WorkshopBasicDetailsComponent,
    WorkshopPreviewComponent,
    WorkshopPaymentComponent,
    MyWorkshopBookingsComponent,
    WorkshopBookingComponent,
    LearnerProfileComponent,
    LearnerGeneralProfileComponent,
    LearnerBackgroundComponent,
    AgencyProfileComponent,
    CreateLearnerProfileComponent,
    SetupLearnerProfileComponent,
    LearnerConfirmationComponent,
    LearnerDashboardComponent,
    MyMembershipsComponent,
    LearnerNotifySettingsComponent,
    LearnerBillingInfoComponent,
    LearnerPrivacySettingsComponent,
    LearnerSecuritySettingsComponent,
    LearnerTransactionHistoryComponent,
    HubExpertsComponent,
    HubMembersComponent,
    HubSecurityCenterComponent,
    HubBillingInformationComponent,
    HubExperiencesComponent,
    HubSpacesComponent,
    HubJobRequestsComponent,
    HubAnalyticsComponent,
    HubMessagesComponent,
    HubMachineQuotesComponent,
    InviteExpertsComponent,
    CustomPaginationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    TagInputModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxPaginationModule,
    NgSelectModule,
    NgxGeoautocompleteModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDGmkGmJzanvRjTGbgjMIoiXGSTTnHnJNE'
    }),
    NgxLoadingModule.forRoot({
      fullScreenBackdrop: true,
      backdropBorderRadius: '3px'
    }),
    NgxSliderModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    ToastNoAnimationModule.forRoot({
      preventDuplicates: true
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
