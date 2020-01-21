import { Component, OnInit } from '@angular/core';
import { AlrajhiumrahService } from 'src/app/services/alrajhiumrah.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BroadcastserviceService } from 'src/app/services/broadcastservice.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})




export class PaymentSuccessComponent implements OnInit {

  public hotelcart: any = {}
  public searchFilterObj: any = {}
  public guests = 0
  public roomsBasePrice = 0
  public roomsFees = 0
  public roomsVAT = 0
  public roomsGDS = 0
  public roomsOTA = 0
  public hotelTotalPrice = 0

  public isHotelBooking: boolean = true





  public transportCart: any = {}
  public transportBasePrice = 0
  public transportVAT = 0
  public transportGDS = 0
  public transportOTA = 0
  public transportTotalPrice = 0
  public transportQuantity = 0

  public groundCart: any = {}
  public groundBasePrice = 0
  public groundVAT = 0
  public groundGDS = 0
  public groundOTA = 0
  public groundTotalPrice = 0
  public groundQuantity = 0

  public cartGrandTotal = 0



  public groundPolicies: any;
  public groundAvailabilityToken: any = "";

  public searchObj: any = {}
  public hotelTrackToken: any = {}

  // traveller forms
  public rooms = []
  public adultsCount = []
  public childrenCount = []
  public adults = []
  public childrens = []
  public roomsForms = []
  public evisaMutmerDetails = []

  public formsArr = [];
  contactForm: FormGroup;

  // reservaton

  public traveller = []
  public travellerDetails = []

  public transportAvailabilityTracktoken: any
  public vehicleCategory = []
  public vehicleTypes = []
  public vehiclePolicies = []
  public countryList = []


  public transportTravellerDetails: any

  walletForm: FormGroup

  constructor(private teejanServices: AlrajhiumrahService, private router: Router, private spinner: NgxSpinnerService,
    private broadcastService: BroadcastserviceService, private formBuilder: FormBuilder, ) { }

  ngOnInit() {
    this.spinner.show()
    this.searchObj = JSON.parse(localStorage.getItem("searchObj"));
    this.hotelcart = JSON.parse(localStorage.getItem("hotelcart"))
    this.searchFilterObj = JSON.parse(localStorage.getItem("searchFilterObj"))
    this.travellerDetails = JSON.parse(localStorage.getItem("travellerDetails"))
    this.transportTravellerDetails = JSON.parse(localStorage.getItem("transportTravellerDetails"))
    this.guests = parseInt(this.searchFilterObj.adults_count) + parseInt(this.searchFilterObj.child_count);
    this.transportCart = JSON.parse(localStorage.getItem('transportcart'))
    this.transportAvailabilityTracktoken = localStorage.getItem("transportAvailabilityTracktoken")
    this.groundCart = JSON.parse(localStorage.getItem('groundCart'))
    this.groundAvailabilityToken = localStorage.getItem("groundAvailabilityToken")
    this.reservation();

  }


  public reservation() {
    this.hotelTrackToken = localStorage.getItem('hotelAvailabilityTracktoken')
    // HotelResrvation 
     this.spinner.hide();
    if (this.hotelcart != null) {
      this.spinner.show();
      /* preparing roomGroups Array  with travellerDetails*/
      /* preparing roomGroups */
      for (var h = 0; h < this.hotelcart.roomGroups.length; h++) {
        let hotelRoomGroup = this.hotelcart.roomGroups[h]
        // preparing rooms in roomGroup
        for (var k = 0; k < hotelRoomGroup.rooms.length; k++) {
          let paxDetail = this.searchObj.request.rooms[k].PaxInfo
          // add paxInfo  
          hotelRoomGroup.rooms[k]["paxInfo"] = paxDetail

          // let availabilityCount = hotelRoomGroup.rooms[k].availabilityCount.length
          // hotelRoomGroup.rooms[k].availabilityCount = availabilityCount

          // removing taxe objects from displayRateInfo
          /* for (let p = 0; p < hotelRoomGroup.rooms[k].displayRateInfo.length; p++) {

            if (hotelRoomGroup.rooms[k].displayRateInfo[p].purpose === "20") {
              hotelRoomGroup.rooms[k].displayRateInfo.splice(p, 1);
              p--

            } else if (hotelRoomGroup.rooms[k].displayRateInfo[p].purpose === "30") {
              hotelRoomGroup.rooms[k].displayRateInfo.splice(p, 1);

              p--
            } else if (hotelRoomGroup.rooms[k].displayRateInfo[p].purpose === "40") {
              hotelRoomGroup.rooms[k].displayRateInfo.splice(p, 1);
              p--

            } else if (hotelRoomGroup.rooms[k].displayRateInfo[p].purpose === "10") {
              hotelRoomGroup.rooms[k].displayRateInfo.splice(p, 1);
              p--

            }

          } */
          // add traveller details 
          hotelRoomGroup.rooms[k]["travellerDetails"] = this.travellerDetails[h].travellersList;
        }

      }

      var randomNumber = Math.floor(Math.random() * 20000000 + 1);
      var CountryCode = this.searchObj.request.providerLocations[0].countryCode
      var locationCode = this.searchObj.request.providerLocations[0].locationCode


      localStorage.setItem("hotelProvider", this.hotelcart.provider)
      console.log(JSON.stringify(this.hotelcart));

      let hotelForm =
      {
        "context": {
          "cultureCode": this.searchObj.context.cultureCode,
          "trackToken": this.hotelTrackToken,
          "providerInfo": [
            {
              "provider": this.hotelcart.provider,
              "pcc": "1004",
              "subpcc": ""
            }
          ]
        },
        "request": {
          "code": this.hotelcart.code,
          "umrahHotelCode": this.hotelcart.umrahHotelCode,
          // "partnerReferenceNo": `${randomNumber}`,
          "name": this.hotelcart.name,
          "countryCode": CountryCode,
          "locationCode": locationCode,
          "locationName": this.searchObj.request.locationName,
          "status": this.hotelcart.status,
          "vendor": this.hotelcart.vendor,
          "provider": this.hotelcart.provider,
          "checkInDate": this.searchObj.request.checkInDate,
          "checkOutDate": this.searchObj.request.checkOutDate,
          "config": this.hotelcart.config,
          "tpExtensions": this.hotelcart.tpExtensions,
          "secureTPExtensions": [],
          "roomGroups": this.hotelcart.roomGroups 
        }
      }
      console.log("hotelForm data: ===>", JSON.stringify(hotelForm));
      this.teejanServices.getHotelReservation(hotelForm).subscribe((data: any) => {
        this.spinner.hide();

         if (data.bookingStatus == "Confirmed") {
         localStorage.setItem("BookingStatus"  , "false")  
        localStorage.setItem('hotelBookingResponse', JSON.stringify(data));
        this.transportReservation();
         
         }
         else {
           this.isHotelBooking = false
            alert("Booking Faild")
            this.router.navigateByUrl("b2c/search")
          //  setTimeout(() => {
          //    // this.router.navigateByUrl("b2c/search")
 
          //  }, 6000)
         } 
      })
    }



  }


  public transportReservation(){

    console.log("transportcart" ,  this.transportCart)
   
    localStorage.setItem("transportProvider", this.transportCart.provider)

                   this.transportCart.secureTPExtensions = []
                   this.transportCart.travellerDetails = this.transportTravellerDetails


    let TransportFormObj = {
      "context": {
        // "cultureCode": this.searchObj.context.cultureCode,
        "trackToken": this.transportAvailabilityTracktoken,
        "providerInfo": [{
          "provider": this.transportCart.provider
        }]
      },
      "request": this.transportCart 




      // {
      //   "companyCode": this.transportCart.companyCode,
      //   "companyName": this.transportCart.companyName,
      //   "companyNameAR": this.transportCart.companyNameAR,
      //   "routeCode": this.transportCart.routeCode,
      //   "routeName": this.transportCart.routeName,
      //   "routeNameAR": this.transportCart.routeNameAR,
      //   "startDate": this.transportCart.startDate,
      //   "vendor": this.transportCart.vendor,
      //   "provider": this.transportCart.provider,
      //   // "freeCancellationDate": this.transportCart.freeCancellationDate,
      //   "vehicleTypes": this.transportCart.vehicleTypes,
      //   // "policies": this.vehiclePolicies,
      //   // "termsAndConditions": this.transportCart.termsAndConditions,
      //   "displayRateInfo": this.transportCart.displayRateInfo,
      //   "config": this.transportCart.config,
      //   "secureTPExtensions": [],
      //   "travellerDetails": this.transportTravellerDetails,
      // }

    }
    console.log("TransportFormObj: ===>", JSON.stringify(TransportFormObj));

    this.teejanServices.getTransportReservation(TransportFormObj).subscribe((data: any) => {
      console.log("transportBookResponse", data);
      if(data.bookingStatus == "Confirmed"){
        localStorage.setItem("BookingStatus"  , "false")  
      
        localStorage.setItem("transportBookingResponse" , JSON.stringify(data))
        this.getGroundServiceReservation();

      }else{
        this.router.navigateByUrl('b2c/mybooking')

      }
      
      // this.getGroundServiceReservation();
    });
  }


  public getGroundServiceReservation():void{
    if (this.groundCart != null) {
      console.log("groundCart", this.groundCart)
     
      localStorage.setItem("groundProvider", this.groundCart.provider)
      this.groundCart.secureTPExtensions = []

      var groundForm = {
        "context": {
          "cultureCode": this.searchObj.context.cultureCode,
          "trackToken": this.groundAvailabilityToken,
          "providerInfo": [{
            "provider": this.groundCart.provider,

          }]
        },
        "request": this.groundCart
        // {
        //   "uoCode": this.groundCart.uoCode,
        //   "uoName": this.groundCart.uoName,
        //   "uoNameAR": this.groundCart.uoNameAR,
        //   "nationality": this.groundCart.nationality,
        //   "countryOfResidence": this.groundCart.countryOfResidence,
        //   "vendor": this.groundCart.vendor,
        //   "provider": this.groundCart.provider,
        //   // "freeCancellationDate": "",
        //   "category": this.groundCart.category,
        //   "additionalServices": this.groundCart.additionalServices,
        //   "displayRateInfo": this.groundCart.displayRateInfo,
        //   "policies": this.groundCart.policies,
        //   "termsAndConditions": this.groundCart.termsAndConditions,
        //   "config": this.groundCart.config,
        //   "secureTPExtensions": [],
        // }

      }
      console.log("groundForm data: ===>", JSON.stringify(groundForm));
      this.teejanServices.getGroundServiceReservation(groundForm).subscribe((data: any) => {
        if (data.bookingStatus == "Confirmed") {
          localStorage.setItem("BookingStatus"  , "true")  

          localStorage.setItem('groundBookingResponse', JSON.stringify(data));
          this.router.navigateByUrl('b2c/mybooking')

        } else {
        this.router.navigateByUrl('b2c/mybooking')
          
        }
      });
    }
  }
}
