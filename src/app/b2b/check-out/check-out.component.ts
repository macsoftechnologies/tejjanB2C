import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlrajhiumrahService } from 'src/app/services/alrajhiumrah.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import { BroadcastserviceService } from 'src/app/services/broadcastservice.service';
import {NgbDatepickerConfig, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-check-out",
  templateUrl: "./check-out.component.html",
  styleUrls: ["./check-out.component.scss"],
  providers: [NgbDatepickerConfig],
  encapsulation: ViewEncapsulation.None
})
export class CheckOutComponent implements OnInit {
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
   
  public numberOfNights : any

  walletForm: FormGroup

  constructor(private fb: FormBuilder,

    private teejanServices: AlrajhiumrahService, private router: Router, private spinner: NgxSpinnerService,
    private broadcastService: BroadcastserviceService, private formBuilder: FormBuilder,
    config: NgbDatepickerConfig, calendar: NgbCalendar
  ) { this.loadcontactForm(fb), this.loadwalletForm(fb)
    config.minDate = {year: 1900, month: 1, day: 1};
  }

  ngOnInit() {


    this.searchObj = JSON.parse(localStorage.getItem("searchObj"));
    this.hotelcart = JSON.parse(localStorage.getItem("hotelcart"))
    this.searchFilterObj = JSON.parse(localStorage.getItem("searchFilterObj"))
    this.guests = parseInt(this.searchFilterObj.adults_count) + parseInt(this.searchFilterObj.child_count);

    this.transportCart = JSON.parse(localStorage.getItem('transportcart'))
    this.transportAvailabilityTracktoken = localStorage.getItem("transportAvailabilityTracktoken")
    this.groundCart = JSON.parse(localStorage.getItem('groundCart'))

    this.groundAvailabilityToken = localStorage.getItem("groundAvailabilityToken")


    this.hotelCalculations();
    this.transportCalculations()
    this.groundCalculations();

    // calculating GrandTotal
    this.cartGrandTotal = this.hotelTotalPrice + this.transportTotalPrice + this.groundTotalPrice + this.guests * 300 + this.guests * 189
    this.hotelTrackToken = localStorage.getItem('hotelAvailabilityTracktoken')

    this.country();
    this.travellerForms();
    // this.loadwalletForm();



    const checkInDate = new Date(this.searchObj.request.checkInDate);
    const checkOutDate = new Date(this.searchObj.request.checkOutDate);

    const timeDiff = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    this.numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

  }


  //wallet Form

  public loadwalletForm(fb) {

    this.walletForm = this.formBuilder.group({
      walletId: ["SA1790941327111000000002", Validators.required],
      walletAuthCode: ["5NMABO6U2RH2ZR5B", Validators.required]

    })

  }



  // get countries list
  public country(): void {

    this.teejanServices.getCountyList().subscribe((data) => {
      this.countryList = data;
    })

  }


  /* preparing travellerForms */
  public travellerForms() {
    this.rooms = this.searchObj.request.rooms;
    for (let m = 0; m < this.rooms.length; m++) {

      this.adultsCount = [];
      this.childrenCount = [];
      this.adults = []

      this.adultsCount = this.rooms[m].PaxInfo.filter(adt => adt.Type == "ADT");

      console.log("adultsCount", this.adultsCount)

      // this.adultsCount[0].  



      for (let j = 0; j < this.adultsCount[0].Quantity; j++) {

        // this.formsArr.push(this.fb.group({
        //   gender: this.fb.control('', [Validators.required]),
        //   firstName: this.fb.control('', [Validators.required]),
        //   middleName: this.fb.control('', [Validators.required]),
        //   lastName: this.fb.control('', [Validators.required]),
        //   birthDate: this.fb.control('', [Validators.required]),
        //   passportNumber: this.fb.control('', [Validators.required]),
        //   locationName: this.fb.control('', [Validators.required]),
        //   address: this.fb.control('', [Validators.required]),
        //   city: this.fb.control('', [Validators.required]),
        //   state: this.fb.control('', [Validators.required]),
        //   country: this.fb.control('', [Validators.required]),
        //   zip: this.fb.control('', [Validators.required]),

        // }))

        var adultObj = {
          gender: "",
          firstName: "",
          middleName: "",
          lastName: "",
          birthDate: "",
          passportNumber: "",
          locationName: "",
          address: "",
          city: "",
          state: "",
          country: "",
          zip: ""
        };
        this.adults.push(adultObj);
      }

      this.childrens = []
      this.childrenCount = [];
      this.childrenCount = this.rooms[m].PaxInfo.filter(chd => chd.Type == "CHD")

      for (let s = 0; s < this.childrenCount.length; s++) {
        var childrenObj = {
          gender: "",
          firstName: "",
          middleName: "",
          lastName: "",
          birthDate: "",

        };
        this.childrens.push(childrenObj);
      }

      var roomObject = {
        sequence: this.rooms[m].Sequence,
        adults: this.adults,
        childrens: this.childrens
      }
      this.roomsForms.push(roomObject);
    }

  }

  public loadcontactForm(fb) {
    this.contactForm = fb.group({
      cgender: [""],
      cfirstName: [""],
      clastName: [""],
      city: [""],
      email: [""],
      mobileNumber: [""],
      secondMobileNumber: [""],
      phoneNumberCountryCode: [""]
    });
  }



  onAdultChange(value, index, key, outerIndex) {
    if (key === "gender") {
      this.roomsForms[outerIndex]["adults"][index].gender = value;
    }
    else if (key === "country") {
      this.roomsForms[outerIndex]["adults"][index].country = value;
    }


  }

  onAddAdult(value, index, key, outerIndex) {

    if (key === "firstName") {
      this.roomsForms[outerIndex]["adults"][index].firstName = value;
    } else if (key === "lastName") {
      this.roomsForms[outerIndex]["adults"][index].lastName = value;
    } else if (key === "birthDate") {
      this.roomsForms[outerIndex]["adults"][index].birthDate = value;
    } else if (key === "middleName") {
      this.roomsForms[outerIndex]["adults"][index].middleName = value;
    } else if (key === "passportNumber") {
      this.roomsForms[outerIndex]["adults"][index].passportNumber = value;
    } else if (key === "locationName") {
      this.roomsForms[outerIndex]["adults"][index].locationName = value;
    } else if (key === "address") {
      this.roomsForms[outerIndex]["adults"][index].address = value;
    } else if (key === "city") {
      this.roomsForms[outerIndex]["adults"][index].city = value;
    } else if (key === "state") {
      this.roomsForms[outerIndex]["adults"][index].state = value;
    } else if (key === "zip") {
      this.roomsForms[outerIndex]["adults"][index].zip = value;
    }
  }

  onChildrenChange(value, index, key, outerIndex) {
    if (key === "gender") {
      this.roomsForms[outerIndex]["childrens"][index].gender = value;
    } else if (key === "country") {
      this.roomsForms[outerIndex]["childrens"][index].country = value;
    }

  }
  onAddChildren(value, index, key, outerIndex) {

    if (key === "firstName") {
      this.roomsForms[outerIndex]["childrens"][index].firstName = value;
    } else if (key === "lastName") {
      this.roomsForms[outerIndex]["childrens"][index].lastName = value;
    } else if (key === "birthDate") {
      this.roomsForms[outerIndex]["childrens"][index].birthDate = value;
    } else if (key === "middleName") {
      this.roomsForms[outerIndex]["childrens"][index].middleName = value;
    }


    console.log("roomForms", this.roomsForms);
  }


  /* preparing travellerForms//  */


  /* Reservatoins API'S Calling (hotel , transport , ground) */

  cardPay(cartGrandTotal) {
    for (var r = 0; r < this.roomsForms.length; r++) {
      this.traveller = []
      for (var q = 0; q < this.roomsForms[r].adults.length; q++) {
        var adultObject =
        {
          "type": "ADT",
          "isMainPax": true,
          "details": {
            "firstName": this.roomsForms[r].adults[q].firstName,
            "middleName": this.roomsForms[r].adults[q].middleName,
            "lastName": this.roomsForms[r].adults[q].lastName,
            "gender": this.roomsForms[r].adults[q].gender,
            "birthDate": "1985-02-25T00:00:00",
            "location": {
              "name": this.roomsForms[r].adults[q].locationName,
              "countryCode": "IN",
              "country": this.roomsForms[r].adults[q].country,
              "address": this.roomsForms[r].adults[q].address,
              "city": this.roomsForms[r].adults[q].city,
              "state": this.roomsForms[r].adults[q].state,
              "zipCode": this.roomsForms[r].adults[q].zip
            },
            "contactInformation": {
              "phoneNumber": `${this.contactForm.value.mobileNumber}`,
              "phoneNumberCountryCode": "91",
              "homePhoneNumber": `${this.contactForm.value.secondMobileNumber}`,
              "homePhoneNumberCountryCode": "91",
              "fax": "",
              "email": this.contactForm.value.email
            }
          }
        }
        this.traveller.push(adultObject);

        if(this.roomsForms[r].adults[q].gender == "M")
        {
          var genderNumber = 1
        }else{
          var genderNumber = 2

        }

        let mutamervisaObj =

        {
          "DateOfBirth": "1995-01-31",
          "PassportNo": this.roomsForms[r].adults[q].passportNumber,
          "NationalityId": "91",
          "Gender": genderNumber
        }



        this.evisaMutmerDetails.push(mutamervisaObj)

      }
      for (var u = 0; u < this.roomsForms[r].childrens.length; u++) {

        var childObject =
        {
          "type": "CHD",
          "isMainPax": true,
          "details": {
            "firstName": this.roomsForms[r].childrens[u].firstName,
            "middleName": this.roomsForms[r].childrens[u].middleName,
            "lastName": this.roomsForms[r].childrens[u].lastName,
            "gender": this.roomsForms[r].childrens[u].gender,
            "birthDate": this.roomsForms[r].childrens[u].birthDate,
            "age": "1",
            "location": {
              "name": this.roomsForms[r].adults[0].locationName,
              "countryCode": "IN",
              "country": this.roomsForms[r].adults[0].country,
              "address": this.roomsForms[r].adults[0].address,
              "city": this.roomsForms[r].adults[0].city,
              "state": this.roomsForms[r].adults[0].state,
              "zipCode": this.roomsForms[r].adults[0].zip
            },
            "contactInformation": {
              "phoneNumber": `${this.contactForm.value.mobileNumber}`,
              "phoneNumberCountryCode": "91",
              "homePhoneNumber": `${this.contactForm.value.secondMobileNumber}`,
              "homePhoneNumberCountryCode": "91",
              "fax": "",
              "email": this.contactForm.value.email
            }
          }
        }

        this.traveller.push(childObject);
      }

      let travellerListObj = {
        travellersList: this.traveller
      }

      this.travellerDetails.push(travellerListObj);

    }


    localStorage.setItem("evisaMutmerDetails", JSON.stringify(this.evisaMutmerDetails))
    localStorage.setItem("travellerDetails", JSON.stringify(this.travellerDetails))
    var transportTravllerObj  = {
      "details": {
        "passportNo": this.roomsForms[0].adults[0].passportNumber,
        "firstName": this.roomsForms[0].adults[0].firstName,
        "middleName": this.roomsForms[0].adults[0].middleName,
        "lastName": this.roomsForms[0].adults[0].lastName,
        "nationalityCode": "IN",
        "fullNameAR": "",
        "gender": this.roomsForms[0].adults[0].gender,
        "birthDate": "1985-02-25T00:00:00",
        "phoneNumber": `${this.contactForm.value.mobileNumber}`,
        "phoneNumberCountryCode": "91",
        "email": this.contactForm.value.email
      }
    }

    localStorage.setItem("transportTravellerDetails" , JSON.stringify(transportTravllerObj))




    var randomNumber = Math.floor(Math.random() * 20000000 + 1);

    let data = {
      "amount": cartGrandTotal,
      "firstName": this.roomsForms[0].adults[0].firstName,
      "lastName": this.roomsForms[0].adults[0].lastName,
      "emailId": this.contactForm.value.email,
      "mobileNumber": `${this.contactForm.value.mobileNumber}`,
      "referenceId": `${randomNumber}`
    }
    // let data = {
    //   "amount": "30",
    //   "firstName": "ds",
    //   "lastName": "dsefiuh",
    //   "emailId":"sanjeev@gmail.com",
    //   "mobileNumber": "865343686",
    //   "referenceId": "451554dcjl"
    // }

    console.log("data", data)
    this.teejanServices.processPayment1(data).subscribe(resp => {
      console.log("success payment page");
      window.location.href = resp.pgLink





    }, err => {
      console.log(err.url);
      // window.open(err.url.toString());
      //  window.location.href = err.url.toString();
    })

    //  let hotelSecureTPExtensions  = [] 
    //  let transportSecureTPExtensions = [] 
    //  let groundSecureTPExtensions =[]

    //   this.reservation(hotelSecureTPExtensions , transportSecureTPExtensions , groundSecureTPExtensions);

  }
  //   wallet(hotelPrice , transportPrice , groundPrice){

  //     let hotelSecureTPExtensions = []
  //     hotelSecureTPExtensions = [
  //        {
  //         key : "payByMoHUWallet.mohuWalletAccNo",
  //         value :  this.walletForm.value.walletId

  //       },
  //       {
  //         key :"payByMoHUWallet.walletAuthCode",
  //         value : this.walletForm.value.walletAuthCode
  //       },
  //       {
  //         key :"payByMoHUWallet.totalPayment",
  //         value : hotelPrice
  //       }

  //   ]
  //   let transportSecureTPExtensions = []
  //   transportSecureTPExtensions = [
  //     {
  //      key : "payByMoHUWallet.mohuWalletAccNo",
  //      value :  this.walletForm.value.walletId

  //    },
  //    {
  //      key :"payByMoHUWallet.walletAuthCode",
  //      value : this.walletForm.value.walletAuthCode
  //    },
  //    {
  //      key :"payByMoHUWallet.totalPayment",
  //      value : transportPrice
  //    }

  // ]
  //   let  groundSecureTPExtensions = []
  //   groundSecureTPExtensions = [
  //   {
  //    key : "payByMoHUWallet.mohuWalletAccNo",
  //    value :  this.walletForm.value.walletId

  //  },
  //  {
  //    key :"payByMoHUWallet.walletAuthCode",
  //    value : this.walletForm.value.walletAuthCode
  //  },
  //  {
  //    key :"payByMoHUWallet.totalPayment",
  //    value : groundPrice
  //  }

  // ]
  //     this.reservation(hotelSecureTPExtensions , transportSecureTPExtensions , groundSecureTPExtensions );

  //   }


  public reservation(hotelSecureTPExtensions, transportSecureTPExtensions, groundSecureTPExtensions) {
    // HotelResrvation 
    if (this.hotelcart != null) {
      this.spinner.show();
      /* preparing roomGroups Array  with travellerDetails*/





      console.log("travellerDetails", this.travellerDetails);
      console.log("this.evisaMutmerDetails", this.evisaMutmerDetails)
      // e visa service



      /* preparing roomGroups */
      for (var h = 0; h < this.hotelcart.roomGroups.length; h++) {
        let hotelRoomGroup = this.hotelcart.roomGroups[h]

        // delete hotelRoomGroup.hasSpecialDeal
        // delete hotelRoomGroup.paxInfo
        // delete hotelRoomGroup.policies
        // delete hotelRoomGroup.tpExtensions
        // this.hotelcart.roomGroups[h]["groupAmount"] = this.hotelTotalPrice
        // preparing rooms in roomGroup
        for (var k = 0; k < hotelRoomGroup.rooms.length; k++) {

          let paxDetail = this.searchObj.request.rooms[k].PaxInfo

          // add paxInfo  
          hotelRoomGroup.rooms[k]["paxInfo"] = paxDetail


          // delete hotelRoomGroup.rooms[k].specialDealId
          // delete hotelRoomGroup.rooms[k].specialDealDescription
          // delete hotelRoomGroup.rooms[k].sequenceNumber
          // delete hotelRoomGroup.rooms[k].images
          // delete hotelRoomGroup.rooms[k].hasSpecialDeal
          // delete hotelRoomGroup.rooms[k].businessName
          // delete hotelRoomGroup.rooms[k].description
          // delete hotelRoomGroup.rooms[k].availabilityCount
          // delete hotelRoomGroup.rooms[k].objectIdentifier
          // delete hotelRoomGroup.rooms[k].features
          // delete hotelRoomGroup.rooms[k].amount

          // let quantity = hotelRoomGroup.rooms[k].quantity
          // hotelRoomGroup.rooms[k]["quantity"] = quantity
          // hotelRoomGroup.rooms[k]["optionalAmenities"] = []
          // hotelRoomGroup.rooms[k]["roomCategory"] = ""

          let availabilityCount = hotelRoomGroup.rooms[k].availabilityCount.length

          hotelRoomGroup.rooms[k].availabilityCount = availabilityCount

          // removing taxe objects from displayRateInfo
          for (let p = 0; p < hotelRoomGroup.rooms[k].displayRateInfo.length; p++) {

            if (hotelRoomGroup.rooms[k].displayRateInfo[p].purpose === "20") {
              hotelRoomGroup.rooms[k].displayRateInfo.splice(p, 1);
              p--

            } else if (hotelRoomGroup.rooms[k].displayRateInfo[p].purpose === "30") {
              hotelRoomGroup.rooms[k].displayRateInfo.splice(p, 1);

              p--
            } else if (hotelRoomGroup.rooms[k].displayRateInfo[p].purpose === "40") {
              hotelRoomGroup.rooms[k].displayRateInfo.splice(p, 1);
              p--

            }

          }

          // add traveller details 
          hotelRoomGroup.rooms[k]["travellerDetails"] = this.travellerDetails[h].travellersList;
        }

      }

      var randomNumber = Math.floor(Math.random() * 20000000 + 1);
      var CountryCode = this.searchObj.request.providerLocations[0].countryCode
      var locationCode = this.searchObj.request.providerLocations[0].locationCode


      localStorage.setItem("hotelProvider", this.hotelcart.provider)

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
          "checkInDate": this.hotelcart.checkInDate,
          "checkOutDate": this.hotelcart.checkOutDate,
          "config": this.hotelcart.config,
          "tpExtensions": this.hotelcart.tpExtensions,
          "secureTPExtensions": hotelSecureTPExtensions,
          // "checkInTime" :  this.hotelcart.checkInTime,
          // "checkOutTime" :  this.hotelcart.checkOutTime,
          // "freeCancellationDate" : this.hotelcart.freeCancellationDate,
          // "nationality" : this.hotelcart.nationality,
          // "flags" : this.hotelcart.flags,
          // "policies" : this.hotelcart.policies,
          "roomGroups": this.hotelcart.roomGroups
        }
      }
      console.log("hotelForm data: ===>", JSON.stringify(hotelForm));
      this.teejanServices.getHotelReservation(hotelForm).subscribe((data: any) => {

        this.spinner.hide();


        if (data.bookingStatus == "Confirmed") {


          // localStorage.removeItem("hotelcart");
          // localStorage.removeItem("hotelAvailability");
          // localStorage.removeItem("hotelAvailabilityTracktoken");
          // localStorage.removeItem("hotelslistrespTrackToken");
          // localStorage.removeItem("currentHotel");

          localStorage.setItem('hotelBookingResponse', JSON.stringify(data));
          this.router.navigateByUrl('b2b/mybooking');

          // transport reservation service 
          if (this.transportCart != null) {

            for (let i = 0; i < this.transportCart.vehicleTypes.length; i++) {
              this.vehicleCategory = this.transportCart.vehicleTypes[i].categories.map((obj) => {
                delete obj.maxPaxCapacity;
                delete obj.availableQuantity;
                return;
              })


              this.vehicleCategory = this.transportCart.vehicleTypes[i].categories.map((obj) => {
                let o = Object.assign({}, obj);
                // o.additionalServices = []
                // o.termsAndConditions = this.transportCart.termsAndConditions;
                o.quantity = this.transportCart.vehicleTypes[i].categories[0].quantity
                o.noOfPax = this.transportCart.vehicleTypes[i].categories[0].noOfPax
                // o.images = [];
                // o.config = [];
                // o.tpExtensions = [];

                return o;
              })
              for (let k = 0; k < this.vehicleCategory[0].displayRateInfo.length; k++) {

                if (this.vehicleCategory[0].displayRateInfo[k].purpose === "20") {

                  this.vehicleCategory[0].displayRateInfo.splice(k, 1)
                  k--
                }
                if (this.vehicleCategory[0].displayRateInfo[k].purpose === "30") {
                  this.vehicleCategory[0].displayRateInfo.splice(k, 1)
                  k--
                }
                if (this.vehicleCategory[0].displayRateInfo[k].purpose === "40") {
                  this.vehicleCategory[0].displayRateInfo.splice(k, 1)
                  k--
                }
              }

              let vehicleObj = {
                vehicleTypeCode: this.transportCart.vehicleTypes[i].vehicleTypeCode,
                vehicleType: this.transportCart.vehicleTypes[i].vehicleType,
                vehicleTypeAR: this.transportCart.vehicleTypes[i].vehicleTypeAR,
                categories: this.vehicleCategory,
              }

              this.vehicleTypes.push(vehicleObj);
            }
            this.vehiclePolicies = this.transportCart.policies.map((obj) => {
              var o = Object.assign({}, obj);
              o.description = ""
              return o;
            })

            localStorage.setItem("transportProvider", this.transportCart.provider)


            let TransportFormObj = {
              "context": {
                "cultureCode": this.searchObj.context.cultureCode,
                "trackToken": this.transportAvailabilityTracktoken,
                "providerInfo": [{
                  "provider": this.transportCart.provider
                }]
              },

              "request": {
                "companyCode": this.transportCart.companyCode,
                "companyName": this.transportCart.companyName,
                "companyNameAR": this.transportCart.companyNameAR,
                "routeCode": this.transportCart.routeCode,
                "routeName": this.transportCart.routeName,
                "routeNameAR": this.transportCart.routeNameAR,
                "startDate": this.transportCart.startDate,
                "vendor": this.transportCart.vendor,
                "provider": this.transportCart.provider,
                // "freeCancellationDate": this.transportCart.freeCancellationDate,
                "vehicleTypes": this.vehicleTypes,
                "policies": this.vehiclePolicies,
                // "termsAndConditions": this.transportCart.termsAndConditions,
                "displayRateInfo": this.transportCart.displayRateInfo,
                "config": this.transportCart.config,
                "secureTPExtensions": transportSecureTPExtensions,
                "travellerDetails": {},

              }

            }
            this.teejanServices.getTransportReservation(TransportFormObj).subscribe((data: any) => {
              if (data.bookingStatus == "Confirmed") {
                localStorage.setItem('transportBookingResponse', JSON.stringify(data));
                //Ground reservation Service 
                if (this.groundCart != null) {
                  for (let n = 0; n < this.groundCart.displayRateInfo.length; n++) {

                    if (this.groundCart.displayRateInfo[n].purpose === "20") {
                      this.groundCart.displayRateInfo.splice(n, 1)
                      n--
                    } else if (this.groundCart.displayRateInfo[n].purpose === "30") {
                      this.groundCart.displayRateInfo.splice(n, 1)
                      n--
                    } else if (this.groundCart.displayRateInfo[n].purpose === "40") {
                      this.groundCart.displayRateInfo.splice(n, 1)
                      n--
                    }

                  }



                  this.groundPolicies = this.groundCart.policies.map((obj) => {
                    var o = Object.assign({}, obj);
                    o.name = "",
                      o.description = ""
                    o.dateCriteria = {
                      "endDate": "",
                      "startDate": ""
                    }
                    return o

                  })
                  localStorage.setItem("groundProvider", this.groundCart.provider)


                  var groundForm = {

                    "context": {
                      "cultureCode": this.searchObj.context.cultureCode,
                      "trackToken": this.groundAvailabilityToken,
                      "providerInfo": [{
                        "provider": this.groundCart.provider,

                      }]
                    },
                    "request": {
                      "uoCode": this.groundCart.uoCode,
                      "uoName": this.groundCart.uoName,
                      "uoNameAR": this.groundCart.uoNameAR,
                      "nationality": this.groundCart.nationality,
                      "countryOfResidence": this.groundCart.countryOfResidence,
                      "vendor": this.groundCart.vendor,
                      "provider": this.groundCart.provider,
                      // "freeCancellationDate": "",
                      "category": this.groundCart.category,
                      // "additionalServices": [],
                      "displayRateInfo": this.groundCart.displayRateInfo,
                      "policies": this.groundCart.policies,
                      "termsAndConditions": this.groundCart.termsAndConditions,
                      "config": this.groundCart.config,
                      "secureTPExtensions": groundSecureTPExtensions,
                    }

                  }

                  console.log("groundForm data: ===>", JSON.stringify(groundForm));
                  this.teejanServices.getGroundServiceReservation(groundForm).subscribe((data: any) => {
                    if (data.bookingStatus == "Confirmed") {
                      localStorage.setItem('groundBookingResponse', JSON.stringify(data));

                      // localStorage.removeItem("groundcart");
                      // localStorage.removeItem("groundAvailability");
                      // localStorage.removeItem("groundAvailabilityToken");
                      // localStorage.removeItem("groundServiceTrackToken");






                    } else {
                      // localStorage.removeItem("groundcart");
                      // localStorage.removeItem("groundAvailability");
                      // localStorage.removeItem("groundAvailabilityToken");
                      // localStorage.removeItem("groundServiceTrackToken");

                    }


                  });
                }


              } else {
                // localStorage.removeItem("transportcart");
                // localStorage.removeItem("transportAvailability");
                // localStorage.removeItem("transportAvailabilityTracktoken");
                // localStorage.removeItem("transportSearchResponse");
                // localStorage.removeItem("transportSearchTrackToken");
                // localStorage.removeItem("transportSearch");


              }



            });
          }




        }
        else {


          // localStorage.removeItem("searchObj");
          // localStorage.removeItem("searchFilterObj");
          // localStorage.removeItem("searchLookUp");



          // localStorage.removeItem("hotelcart");
          // localStorage.removeItem("hotelAvailability");
          // localStorage.removeItem("hotelAvailabilityTracktoken");
          // localStorage.removeItem("hotelslistrespTrackToken");
          // localStorage.removeItem("currentHotel");

          // localStorage.removeItem("transportcart");
          // localStorage.removeItem("transportAvailability");
          // localStorage.removeItem("transportAvailabilityTracktoken");
          // localStorage.removeItem("transportSearchResponse");
          // localStorage.removeItem("transportSearchTrackToken");
          // localStorage.removeItem("transportSearch");


          // localStorage.removeItem("groundcart");
          // localStorage.removeItem("groundAvailability");
          // localStorage.removeItem("groundAvailabilityToken");
          // localStorage.removeItem("groundServiceTrackToken");


          this.isHotelBooking = false

          alert("Booking Faild")

          // this.router.navigateByUrl("b2b/search")
          setTimeout(() => {
            this.router.navigateByUrl("b2b/search")

          }, 6000)


        }
      })
    }



  }
  onNavToSearch() {

    //  this.router.navigateByUrl("b2b/search")

  }



  // hotel calculations 
  public hotelCalculations() {
    if (this.hotelcart != null || this.hotelcart != undefined) {
      let roomsDisplayRates = this.hotelcart.roomGroups[0].rooms.map(
        rate => rate.displayRateInfo
      );

      roomsDisplayRates.forEach(roomRate => {
        roomRate.forEach(priceDetails => {
          if (priceDetails.purpose == "1") {

                  
            this.roomsGDS += priceDetails.amount / 100 * 7.5
            this.roomsOTA += priceDetails.amount / 100 * 30;

              
            this.roomsBasePrice += priceDetails.amount;
          }
          if (priceDetails.purpose == "2") {
            this.roomsFees += priceDetails.amount;
          }
          // if (priceDetails.purpose == "20") {
          //   this.roomsGDS += priceDetails.amount;
          // }
          // if (priceDetails.purpose == "30") {
          //   this.roomsOTA += priceDetails.amount;
          // }
          if (priceDetails.purpose == "7") {
            this.roomsVAT += priceDetails.amount;
          }
        });
      });

      this.hotelTotalPrice =
        this.roomsBasePrice +
        this.roomsFees +
        this.roomsVAT +
        this.roomsGDS +
        this.roomsOTA;
      console.log("hoteTotalPrice", this.hotelTotalPrice);
    }
  }

  // transport calculations
  public transportCalculations() {
    if (this.transportCart != null || this.transportCart != undefined) {
      let transportCategories = this.transportCart.vehicleTypes.map(
        vehicel => vehicel.categories
      );

      transportCategories.forEach(category => {
        this.transportQuantity += category[0].quantity;
        category[0].displayRateInfo.forEach(rate => {
          if (rate.purpose == "1") {
            this.transportBasePrice += rate.amount * this.transportQuantity;
            // console.log("transportBasePrice", this.transportBasePrice);

            this.transportGDS += rate.amount / 100 * 7.5 * this.transportQuantity;
            this.transportOTA += rate.amount / 100 * 30 * this.transportQuantity;
             
           
          }
          if (rate.purpose == "7") {
            this.transportVAT += rate.amount * this.transportQuantity;
            // console.log("transportVAT", this.transportVAT);
          }
          // if (rate.purpose == "20") {
          //   this.transportGDS += rate.amount * this.transportQuantity;
          //   console.log("transportGDS", this.transportGDS);
          // }
          // if (rate.purpose == "30") {
          //   this.transportOTA += rate.amount * this.transportQuantity;
          //   console.log("transportOTA", this.transportOTA);
          // }
        });
      });

      this.transportTotalPrice =
        this.transportBasePrice +
        this.transportVAT +
        this.transportGDS +
        this.transportOTA;

      console.log("transportTotalPrice", this.transportTotalPrice);
    }
  }

  // ground calculations 
  public groundCalculations() {
    if (this.groundCart != null || this.groundCart != undefined) {
      this.groundQuantity = 1;
      if(this.groundCart.displayRateInfo !=undefined){ this.groundCart.displayRateInfo.forEach(rate => {
        if (rate.purpose == "1") {
          this.groundBasePrice += rate.amount * this.groundQuantity;
          // console.log("groundBasePrice", this.groundBasePrice);
          this.groundGDS += rate.amount / 100 * 7.5  * this.groundQuantity;
          this.groundOTA += rate.amount / 100 * 30 * this.groundQuantity;


        }
        if (rate.purpose == "7") {
          this.groundVAT += rate.amount * this.groundQuantity;
          console.log("groundVAT", this.groundVAT);
        }
        // if (rate.purpose == "20") {
        //   this.groundGDS += rate.amount * this.groundQuantity;
        //   console.log("groundGDS", this.groundGDS);
        // }
        // if (rate.purpose == "30") {
        //   this.groundOTA += rate.amount * this.groundQuantity;
        //   console.log("groundOTA", this.groundOTA);
        // }
      });
      this.groundTotalPrice =
        this.groundBasePrice + this.groundVAT + this.groundGDS + this.groundOTA;}
     
    }
  }

}
