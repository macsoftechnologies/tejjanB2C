import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AgmCoreModule } from "@agm/core";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxPaginationModule } from "ngx-pagination";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { B2BRoutingModule } from "./b2b-routing.module";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

import { B2bSignInComponent } from "./b2b-sign-in/b2b-sign-in.component";
import { B2bSignUpComponent } from "./b2b-sign-up/b2b-sign-up.component";
import { SearchPanelComponent } from "./search-panel/search-panel.component";
import { HotelsListComponent } from "./hotels-list/hotels-list.component";
import { HotelDetailsComponent } from "./hotel-details/hotel-details.component";
import { BookingSummaryComponent } from "./booking-summary/booking-summary.component";
import { CheckOutComponent } from "./check-out/check-out.component";
import { TransportServiceComponent } from "./transport-service/transport-service.component";
import { GroundServiceComponent } from "./ground-service/ground-service.component";
import { B2bProfileComponent } from "./b2b-profile/b2b-profile.component";

import { NgSelectModule } from "@ng-select/ng-select";
import { HotelSearchPipe } from "../shared/pipes/HotelSearchPipe";
import { UniquePipe } from "../shared/pipes/UniquePipe";
import { TransportSearchPipe } from "../shared/pipes/TransportSearchPipe";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { MyBookingComponent } from "./my-booking/my-booking.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { FaqComponent } from "./faq/faq.component";
import { DropdownModule } from 'angular-custom-dropdown';
import { Ng5SliderModule } from "ng5-slider";
import { LightboxModule } from "@ngx-gallery/lightbox";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxTextOverflowClampModule } from "ngx-text-overflow-clamp";
import { BookingCancelComponent } from './booking-cancel/booking-cancel.component';
import {NgxPrintModule} from 'ngx-print';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentFailureComponent } from './payment-failure/payment-failure.component';
@NgModule({
  declarations: [
    B2bSignInComponent,
    B2bSignUpComponent,
    SearchPanelComponent,
    HotelsListComponent,
    HotelDetailsComponent,
    BookingSummaryComponent,
    CheckOutComponent,
    TransportServiceComponent,
    GroundServiceComponent,
    B2bProfileComponent,
    HotelSearchPipe,
    UniquePipe,
    TransportSearchPipe,
    MyBookingComponent,
    ContactUsComponent,
    FaqComponent,
    BookingCancelComponent,
    PaymentSuccessComponent,
    PaymentFailureComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
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
    NgxSpinnerModule,
    NgxPrintModule,
    DropdownModule,
    /* AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBcWi1J7vn47wgG815QpbvCeklS_AnGzbU'
    }), */
    B2BRoutingModule,
    NgSelectModule,
    LightboxModule,
    NgxTextOverflowClampModule
  ],

  exports: [
    B2bSignInComponent,
    B2bSignUpComponent,
    SearchPanelComponent,
    HotelsListComponent,
    HotelDetailsComponent,
    BookingSummaryComponent,
    CheckOutComponent,
    TransportServiceComponent,
    GroundServiceComponent,
    B2bProfileComponent,
    HotelSearchPipe,
    UniquePipe,
    TransportSearchPipe,
    MyBookingComponent,
    ContactUsComponent,
    FaqComponent
  ]
})
export class B2BModule {
  constructor() {
    localStorage.setItem("modulepath", "b2b");
  }
}
