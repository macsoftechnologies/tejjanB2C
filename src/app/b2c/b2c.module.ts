import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { B2CRoutingModule } from "./b2c-routing.module";
import { B2bSignInComponent } from '../b2b/b2b-sign-in/b2b-sign-in.component';
import { B2bSignUpComponent } from '../b2b/b2b-sign-up/b2b-sign-up.component';
import { SearchPanelComponent } from '../b2b/search-panel/search-panel.component';
import { HotelsListComponent } from '../b2b/hotels-list/hotels-list.component';
import { HotelDetailsComponent } from '../b2b/hotel-details/hotel-details.component';
import { BookingSummaryComponent } from '../b2b/booking-summary/booking-summary.component';
import { CheckOutComponent } from '../b2b/check-out/check-out.component';
import { TransportServiceComponent } from '../b2b/transport-service/transport-service.component';
import { GroundServiceComponent } from '../b2b/ground-service/ground-service.component';
import { B2bProfileComponent } from '../b2b/b2b-profile/b2b-profile.component';
import { HotelSearchPipe } from '../shared/pipes/HotelSearchPipe';
import { UniquePipe } from '../shared/pipes/UniquePipe';
import { TransportSearchPipe } from '../shared/pipes/TransportSearchPipe';
import { MyBookingComponent } from '../b2b/my-booking/my-booking.component';
import { ContactUsComponent } from '../b2b/contact-us/contact-us.component';
import { FaqComponent } from '../b2b/faq/faq.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { Ng5SliderModule } from 'ng5-slider';
import { NgSelectModule } from '@ng-select/ng-select';
import { LightboxModule } from '@ngx-gallery/lightbox';
import { RecaptchaModule } from 'ng-recaptcha';
import { B2BModule } from '../b2b/b2b.module';
import { B2cSignUpComponent } from './b2c-sign-up/b2c-sign-up.component';
import { BroadcastserviceService } from '../services/broadcastservice.service';

@NgModule({
  declarations: [B2cSignUpComponent],
  imports: [CommonModule, B2CRoutingModule, FormsModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyBcWi1J7vn47wgG815QpbvCeklS_AnGzbU"
    }),
    ReactiveFormsModule,
    NgbModule,
    PerfectScrollbarModule,
    NgxPaginationModule,
    AngularFontAwesomeModule,
    NgxSkeletonLoaderModule,
    Ng5SliderModule,
    NgSelectModule,
    B2BModule,
    LightboxModule,
    RecaptchaModule],
  entryComponents: [
    B2bSignUpComponent],
})
export class B2CModule { 
  constructor(private broadcastservice:BroadcastserviceService){
    this.broadcastservice.stepperValue.emit(0);
    localStorage.setItem("stepperVal",""+0);
  }
}
