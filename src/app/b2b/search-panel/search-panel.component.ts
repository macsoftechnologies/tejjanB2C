import { Component, OnInit, ViewChild, ElementRef, Inject } from "@angular/core";
import { AlrajhiumrahService } from "src/app/services/alrajhiumrah.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatePipe, DOCUMENT } from "@angular/common";
import { NgbDateStruct, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
import { BroadcastserviceService } from "src/app/services/broadcastservice.service";

@Component({
  selector: "app-search-panel",
  templateUrl: "./search-panel.component.html",
  styleUrls: ["./search-panel.component.scss"],
  providers: [DatePipe]
})
export class SearchPanelComponent implements OnInit {
  //view child for check in and check out ngb datepickers
  @ViewChild("checkIn") checkInEl: ElementRef;
  @ViewChild("checkOut") checkOutEl: ElementRef;
  public chekInMinDate = undefined;
  public chekOutMinDate: NgbDateStruct;
  ValidationFlag: boolean = false;
  public number_adults: number = 2;
  public number_children: number = 0;
  public number_rooms: number = 1;
  public showTravellerSec: number = 0;
  public travellerCount: number = 0;
  public selectedCountryCode: string = "IN";
  public seectedCity: String;
  public selectedSearchObj: any;
  public searchResult: any;
  public searchHotelsForm: FormGroup; //

  //Location key
  public locationSearch;
  public searchValidationFlag: boolean;

  public tranportCategories = [];
  public trasportAdditionalServices = [];
  public vehicleTypes = [];
  public vehicleTypesList = [];
  public transportRoutes = [];
  public transportCompanies = [];
  public groundServicesCompanies = [];
  public groundServicePackageServices = [];
  public groundServiceAdditionalServices = [];
  public countries = [];
  public tranportLookUp: any;
  public groundServiceLookUp: any;
  public departureDate;
  public returnDate;

  public roomCount: number = 0;
  public guestInfo = [];
  public child_ages = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private datepipe: DatePipe,
    private tejaanServices: AlrajhiumrahService,
    private broadCastService: BroadcastserviceService, @Inject(DOCUMENT) document: any
  ) {
    this.broadCastService.customStepper.emit(true);
    const current = new Date();
    this.chekInMinDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate()
    };

    this.chekOutMinDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate() + 1
    };

    this.getSearchLookUp();
    this.getTranportLookUp();
    this.getGroundServiceLookUp();
    this.getCountries();
    this.loadSearchHotelsForm(this.fb);
  }

  ngOnInit() {
    if (this.calculateGuestCount() < 9 || this.calculateGuestCount() == 0) {
      this.roomCount = this.roomCount + 1;
      var guest = {
        adult: 1,
        child: 0,
        childAges: []
      };
      this.guestInfo.push(guest);
    }
  }

  /* Search Form controls declaration */
  loadSearchHotelsForm(fb): void {
    this.searchHotelsForm = fb.group({
      location: [null, Validators.required],
      checkIn: [this.chekInMinDate, Validators.required],
      checkOut: [this.chekOutMinDate, Validators.required],
      rooms: ["1", Validators.required],
      adults_count: ["1", Validators.required],
      child_count: ["0", Validators.required],
      vehicleType: [null],
      tranportationClass: [null],
      route: [null, Validators.required],
      vehicleQuantity: [null, Validators.required],
      groundServicePackage: [null],
      nationality: [null, Validators.required],
      countryOfResidence : [null , Validators.required],
      transportAdditionalServices : [null]
    });

    // Select checkIn date set checkout min date
    this.searchHotelsForm.get("checkIn").valueChanges.subscribe(data => {
      var lastday = new Date(data.year, data.month, 0).getDate();
      if (lastday == data.day) {
        this.chekOutMinDate = {
          year: data.year,
          month: data.month + 1,
          day: 1
        };
      } else {
        this.chekOutMinDate = {
          year: data.year,
          month: data.month,
          day: data.day + 1
        };
      }
      setTimeout(() => {
        this.checkOutEl.nativeElement.focus();
      }, 100);
    });
  }

  /* call places master data service call */
  public getSearchLookUp(): void {
    this.tejaanServices.getSearchLookup().subscribe(
      searchLookUpResp => {
        this.locationSearch = searchLookUpResp;
        if (this.locationSearch != undefined)
          this.searchHotelsForm.patchValue({
            location: this.locationSearch[0]  
          });
        localStorage.setItem("searchLookUp", JSON.stringify(searchLookUpResp));
      },
      err => {}
    );
  }

  /* call places master data service call */
  public getTranportLookUp(): void {
    this.tejaanServices.getTransportLookup().subscribe(
      transportLookUpResp => {
        this.tranportLookUp = transportLookUpResp;
        this.vehicleTypes = JSON.parse(
          transportLookUpResp.vehicletypes
        ).vehicleTypes;
        this.trasportAdditionalServices = JSON.parse(
          transportLookUpResp.additionalservices
        ).additionalServices;
        this.tranportCategories = JSON.parse(
          transportLookUpResp.categories
        ).categories;
        this.transportRoutes = JSON.parse(transportLookUpResp.routes).routes;
        if(transportLookUpResp.companies!=""){
          this.transportCompanies = JSON.parse(
            transportLookUpResp.companies
          ).companies;
        }else{
          this.transportCompanies = [];
        }
       

        if (this.transportRoutes != undefined)
          this.searchHotelsForm.patchValue({
            route: this.transportRoutes[0]
          });
      },
      err => {}
    );
  }

  /* call places master data service call */
  public getGroundServiceLookUp(): void {
    this.tejaanServices.getGroundServiceLookup().subscribe(
      groundServiceLookUpResp => {
        this.groundServiceLookUp = groundServiceLookUpResp;
        this.groundServicePackageServices = JSON.parse(
          groundServiceLookUpResp.categories
        ).categories;
        this.groundServicesCompanies = JSON.parse(
          groundServiceLookUpResp.uocompanies
        ).companies;
        this.groundServiceAdditionalServices = JSON.parse(
          groundServiceLookUpResp.additionalservices
        ).additionalServices;
      },
      err => {}
    );
  }

  // get countries list
  public getCountries(): void {
    this.tejaanServices.getCountyList().subscribe(data => {
      this.countries = data;
    });
  }

  public onSearch(): void {
    this.searchValidationFlag = this.searchHotelsForm.valid ? false : true;

    if (!this.searchValidationFlag) {
      // checkInDay
      if (this.searchHotelsForm.value.checkIn.day < 10)
        this.searchHotelsForm.value.checkIn.day = `0${this.searchHotelsForm.value.checkIn.day}`;
      else
        this.searchHotelsForm.value.checkIn.day = `${this.searchHotelsForm.value.checkIn.day}`;

      // checkOutDay
      if (this.searchHotelsForm.value.checkOut.day < 10)
        this.searchHotelsForm.value.checkOut.day = `0${this.searchHotelsForm.value.checkOut.day}`;
      else
        this.searchHotelsForm.value.checkOut.day = `${this.searchHotelsForm.value.checkOut.day}`;

      // checkInMonth
      if (this.searchHotelsForm.value.checkIn.month < 10)
        this.searchHotelsForm.value.checkIn.month = `0${this.searchHotelsForm.value.checkIn.month}`;
      else
        this.searchHotelsForm.value.checkIn.month = `${this.searchHotelsForm.value.checkIn.month}`;

      // checkOutMonth
      if (this.searchHotelsForm.value.checkOut.month < 10)
        this.searchHotelsForm.value.checkOut.month = `0${this.searchHotelsForm.value.checkOut.month}`;
      else
        this.searchHotelsForm.value.checkOut.month = `${this.searchHotelsForm.value.checkOut.month}`;

      let checkInDate =
        this.searchHotelsForm.value.checkIn.year +
        "-" +
        this.searchHotelsForm.value.checkIn.month +
        "-" +
        this.searchHotelsForm.value.checkIn.day;
      let checkOutDate =
        this.searchHotelsForm.value.checkOut.year +
        "-" +
        this.searchHotelsForm.value.checkOut.month +
        "-" +
        this.searchHotelsForm.value.checkOut.day;

      let roomInfo = [];
      this.guestInfo.forEach((guest, index) => {
        let paxInfo = [];
        let adultObj = {
          Type: "ADT",
          Quantity: guest.adult
        };
        paxInfo.push(adultObj);
        guest.childAges.forEach(child_age => {
          let childObj = {
            Type: "CHD",
            age: child_age.childAge
          };
          paxInfo.push(childObj);
        });

        var obj = {
          Sequence: index,
          PaxInfo: paxInfo
        };
        roomInfo.push(obj);
      });

      let searchObj = {
        context: {
          cultureCode: this.searchHotelsForm.value.location.languageCode,
          metaIncluded: "false",
          providerInfo: [
            {
              pcc: "1004",
              provider: "HUDXConnect",
              subpcc: ""
            }
          ]
        },
        request: {
          providerLocations: [
            {
              provider: "HUDXConnect",
              locationCode: this.searchHotelsForm.value.location.locationCode,
              type: "Hotel",
              countryCode: this.searchHotelsForm.value.location.countryCode
            }
          ],
          locationName: this.searchHotelsForm.value.location.city,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
          rooms: roomInfo,
          status: "Available",
          // nationality: this.searchHotelsForm.value.location.countryCode
        }
      };
      const adultCount =  this.guestInfo.reduce((a,b)=>  a + b.adult , 0)
      const childCount =  this.guestInfo.reduce((a,b)=>  a + b.child , 0)

       this.searchHotelsForm.patchValue({
        rooms: this.guestInfo.length,
        adults_count : adultCount,
        child_count : childCount
       })


      localStorage.setItem("searchObj", JSON.stringify(searchObj));
      localStorage.setItem(
        "searchFilterObj",
        JSON.stringify(this.searchHotelsForm.value)
      );
      this.broadCastService.stepperValue.emit(1);
      localStorage.setItem("stepperVal", 1 + "");
      this.router.navigateByUrl("b2c/hotellist");
    }
  }

  /* increase room count */
  public increaseRoomCount(): void {
    if (this.calculateGuestCount() < 9 || this.calculateGuestCount() == 0) {
      this.roomCount = this.roomCount + 1;
      var guest = {
        adult: 1,
        child: 0,
        childAges: []
      };
      this.guestInfo.push(guest);
    }
  }

  /* decrease room count */
  public decreaseRoomCount(): void {
    if (this.roomCount > 1) {
      this.roomCount = this.roomCount - 1;
      this.guestInfo.splice(-1, 1);
    }

    if (this.roomCount == 0) this.isCollapsed = false;
  }

  /* decrease adult count */
  public decreaseAdultCount(index): void {
    if (this.calculateGuestCount() == 1) {
      this.guestInfo[index]["adult"] = 1;
    } else {
      if (parseInt(this.guestInfo[index]["adult"]) != 0)
        this.guestInfo[index]["adult"] =
          parseInt(this.guestInfo[index]["adult"]) - 1;
    }
  }
  /* Increase adult count */
  public increaseAdultCount(index): void {
    if (this.calculateGuestCount() < 9)
      this.guestInfo[index]["adult"] =
        parseInt(this.guestInfo[index]["adult"]) + 1;
  }

  /* method to decrease childcount */
  public decreaseChildCount(index): void {
    if (this.calculateGuestCount() == 1) {
      this.guestInfo[index]["child"] = 0;
    } else {
      if (parseInt(this.guestInfo[index]["child"]) != 0)
        this.guestInfo[index]["child"] =
          parseInt(this.guestInfo[index]["child"]) - 1;
      this.guestInfo[index]["childAges"].splice(-1, 1);
    }
  }
  /* method to increase childcount */
  public increaseChildCount(index): void {
    if (this.calculateGuestCount() < 9)
      this.guestInfo[index]["child"] =
        parseInt(this.guestInfo[index]["child"]) + 1;
    let childAgeObj = {
      childAge: 0
    };
    this.guestInfo[index]["childAges"].push(childAgeObj);
  }

  /* Child age change event */
  public changeChildAge(event, guestIndex, childIndex): void {
    if (event != undefined)
      this.guestInfo[guestIndex]["childAges"][childIndex][
        "childAge"
      ] = parseInt(event);
    else this.guestInfo[guestIndex]["childAges"][childIndex]["childAge"] = 0;
  }

  /* calculate total guest count */
  public calculateGuestCount(): number {
    let guestCount = 0;
    this.guestInfo.forEach(element => {
      guestCount = guestCount + element.adult + element.child;
    });
    return guestCount;
  }

  /* --Passenger Class-- */
  isCollapsed = true;
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }


  
}
