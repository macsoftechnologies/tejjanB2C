import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { B2bSignInComponent } from "./b2b-sign-in/b2b-sign-in.component";
import { B2bSignUpComponent } from "./b2b-sign-up/b2b-sign-up.component";
import { SearchPanelComponent } from './search-panel/search-panel.component';
import { HotelsListComponent } from './hotels-list/hotels-list.component';
import { HotelDetailsComponent } from './hotel-details/hotel-details.component';
import { TransportServiceComponent } from './transport-service/transport-service.component';
import { GroundServiceComponent } from './ground-service/ground-service.component';
import { B2bProfileComponent } from './b2b-profile/b2b-profile.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { MyBookingComponent } from './my-booking/my-booking.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FaqComponent } from './faq/faq.component';
import { BookingSummaryComponent } from './booking-summary/booking-summary.component';
import { BookingCancelComponent } from './booking-cancel/booking-cancel.component';
import { BookingListComponent } from './booking-list/booking-list.component';

const routes: Routes = [
  {
    path: "",
    redirectTo: "signin",
    pathMatch: "full"
  },
  {
    path: "signin",
    component: B2bSignInComponent
  },
  {
    path: "signup",
    component: B2bSignUpComponent
  },
  {
    path: "search",
    component: SearchPanelComponent
  },
  {
    path: "hotellist",
    component: HotelsListComponent
  }, 
  {
    path: "hoteldetails",
    component: HotelDetailsComponent
  },
  {
    path:"transport",
    component:TransportServiceComponent
  },
  {
    path:"ground",
    component:GroundServiceComponent
  },
  {
    path:"profile",
    component: B2bProfileComponent
  },
  {
    path:"checkout",
    component: CheckOutComponent
  },
  {
    path: "mybooking",
    component: MyBookingComponent
  },
  {
    path: "contactus",
    component: ContactUsComponent
  },
  {
    path: "faq",
    component: FaqComponent
  },
  {
    path: "bookingsummary",
    component:BookingSummaryComponent
  },
  {
    path: "bookingcancel",
    component: BookingCancelComponent
  },
  {
    path: "bookinglist",
    component: BookingListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class B2BRoutingModule { }
