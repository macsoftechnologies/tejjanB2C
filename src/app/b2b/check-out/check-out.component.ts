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
  ) { this.loadcontactForm(fb), 
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
   



    const checkInDate = new Date(this.searchObj.request.checkInDate);
    const checkOutDate = new Date(this.searchObj.request.checkOutDate);

    const timeDiff = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    this.numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

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
   

    
    this.teejanServices.processPayment1(data).subscribe(resp => {
      console.log("success payment page");
      window.location.href = resp.pgLink

    }, err => {
      console.log(err.url);
      // window.open(err.url.toString());
      //  window.location.href = err.url.toString();
    })



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

      localStorage.setItem("hotelAmount" , JSON.stringify(this.hotelTotalPrice))
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
         
        });
      });

      this.transportTotalPrice =
        this.transportBasePrice +
        this.transportVAT +
        this.transportGDS +
        this.transportOTA;

      console.log("transportTotalPrice", this.transportTotalPrice);
      localStorage.setItem("transportAmount" , JSON.stringify(this.transportTotalPrice))

    }
  }

  // ground calculations 
  public groundCalculations() {
    if (this.groundCart != null || this.groundCart != undefined) {
      this.groundQuantity = 1;
      if(this.groundCart.category.displayRateInfo !=undefined)
      { this.groundCart.category.displayRateInfo.forEach(rate => {
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
        
      });
      this.groundTotalPrice =
        this.groundBasePrice + this.groundVAT + this.groundGDS + this.groundOTA;}
        localStorage.setItem("groundAmount" , JSON.stringify(this.groundTotalPrice))

     
    }
  }

}
