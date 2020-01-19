import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { B2bSignInComponent } from '../b2b/b2b-sign-in/b2b-sign-in.component';
import { B2bSignUpComponent } from '../b2b/b2b-sign-up/b2b-sign-up.component';
import { SearchPanelComponent } from '../b2b/search-panel/search-panel.component';
import { HotelsListComponent } from '../b2b/hotels-list/hotels-list.component';
import { HotelDetailsComponent } from '../b2b/hotel-details/hotel-details.component';
import { TransportServiceComponent } from '../b2b/transport-service/transport-service.component';
import { GroundServiceComponent } from '../b2b/ground-service/ground-service.component';
import { B2bProfileComponent } from '../b2b/b2b-profile/b2b-profile.component';
import { CheckOutComponent } from '../b2b/check-out/check-out.component';
import { MyBookingComponent } from '../b2b/my-booking/my-booking.component';
import { ContactUsComponent } from '../b2b/contact-us/contact-us.component';
import { FaqComponent } from '../b2b/faq/faq.component';
import { BookingSummaryComponent } from '../b2b/booking-summary/booking-summary.component';
import { PaymentSuccessComponent } from '../b2b/payment-success/payment-success.component';
import { PaymentFailureComponent } from '../b2b/payment-failure/payment-failure.component';
import { B2cSignUpComponent } from './b2c-sign-up/b2c-sign-up.component';

const routes: Routes = [{
  path: "",
  redirectTo: "search",
  pathMatch: "full"
},
{
  path:"login",
  component:B2bSignInComponent
},
{
  path:"signup",
  component:B2cSignUpComponent
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
  path: "payment/success",
  component:PaymentSuccessComponent
},{
  path: "payment/failure",
  component:PaymentFailureComponent
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class B2CRoutingModule { }
