import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  ElementRef,
  Inject
} from "@angular/core";
import { Router } from "@angular/router";
import { AlrajhiumrahService } from "src/app/services/alrajhiumrah.service";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { Options, LabelType } from "ng5-slider";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { BroadcastserviceService } from "src/app/services/broadcastservice.service";
import { DOCUMENT } from "@angular/platform-browser";

@Component({
  selector: "app-hotels-list",
  templateUrl: "./hotels-list.component.html",
  styleUrls: ["./hotels-list.component.scss"]
})
export class HotelsListComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = { suppressScrollX: true };
  public hotels = [];
  public mainHotelsList = [];
  public searchData: any;
  public name_filter: string = "";
  public address_filter: string;
  public page = 1; //pagination
  // For sorting hotesl object
  sortType = [
    {
      type: "name",
      displayName: "Hotel Name",
      subtype: "org",
      icon: ""
    },

    {
      type: "rating",
      displayName: "Star Rating",
      subtype: "org",
      icon: ""
    },
    {
      type: "price",
      displayName: "Price",
      subtype: "org",
      icon: ""
    }
  ];

  /* Filters variables */
  //filter viewChildren
  @ViewChildren("ratingCheckbox") ratingCheckbox: QueryList<ElementRef>;
  @ViewChildren("ratingTACheckbox") ratingTACheckbox: QueryList<ElementRef>;
  @ViewChildren("budgetCheckbox") budgetCheckbox: QueryList<ElementRef>;
  @ViewChildren("categoryCheckbox") CategoryCheckbox: QueryList<ElementRef>;
  @ViewChildren("chainsCheckbox") chainsCheckbox: QueryList<ElementRef>;
  @ViewChildren("propertyTypeCheckbox") propertyTypeCheckbox: QueryList<
    ElementRef
  >;
  @ViewChildren("locationsCheckbox") locationsCheckbox: QueryList<ElementRef>;
  @ViewChildren("amenitiesCheckbox") amenitiesCheckbox: QueryList<ElementRef>;
  @ViewChildren("attractionsCheckbox") attractionsCheckbox: QueryList<
    ElementRef
  >;
  @ViewChildren("mealPlansCheckbox") mealPlansCheckbox: QueryList<ElementRef>;
  @ViewChildren("RPCheckbox") RPCheckbox: QueryList<ElementRef>;
  @ViewChildren("POICheckbox") POICheckbox: QueryList<ElementRef>;
  //Hold selected filters
  selectedAmenities: any[] = [];
  selectedRating: any[] = [];
  selectedCategoryList: any[] = [];
  selectedPropertyType: any[] = [];
  selectedLocalitiesList: any[] = [];
  selectedChains: any[] = [];
  selectedRoomAmenities: any[] = [];
  selectedReservationPolicy: any[] = [];

  //Filter labels
  filterAmenities: any[] = [];
  filterCategories: any[] = [];
  filterPropertyType: any[] = [];
  filterLocalites: any[] = [];
  filterChains: any[] = [];
  filterRoomAmenities: any[] = [];
  filterReservationPolicy: any[] = [];

  hasAmenities: boolean = false;
  hasCategories: boolean = false;
  hasLocations: boolean = false;
  hasPropertyTypes: boolean = false;
  hasRoomAmenities: boolean = false;
  hasHotelChains: boolean = false;
  hasReservationPolicy: boolean = false;

  zoom = 14;
  userView = true;

  //Filter Rating label
  setRating: any[] = [
    { name: "1", isSelected: false },
    { name: "2", isSelected: false },
    { name: "3", isSelected: false },
    { name: "4", isSelected: false },
    { name: "5", isSelected: false }
  ];
  isFirstTimeLoad: boolean = true;

  //Start Range values
  value: number = 100;
  distanceOptions: Options = {
    floor: 0 ,
    ceil: 10,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return   value + " km";
        case LabelType.High:
          return  value + " km";
        default:
          return  value + " km";
      }
    }
  };
  minValue: number = 100;
  maxValue: number = 400;
  options: Options = {
    floor: 0,
    ceil: 500,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return "SAR" + value;
        case LabelType.High:
          return "SAR" + value;
        default:
          return "$" + value;
      }
    }
  };
  // End Range values

  public isViewChange: boolean = true;
  public searchHotelForm: FormGroup;
  chekInMinDate: { year: any; month: any; day: any };
  chekOutMinDate: { year: any; month: any; day: any };
  public itemsPerPage: number = 5;
  public isFilterDisplay: boolean = false;

  constructor(
    private router: Router,
    private teejanServices: AlrajhiumrahService,
    private fb: FormBuilder,
    private broadcastService: BroadcastserviceService,
    @Inject(DOCUMENT) document: any
  ) {
    this.broadcastService.customStepper.emit(true);
    this.searchData = JSON.parse(localStorage.getItem("searchObj"));
    this.loadSearchForm();
    this.getHotels();
  }

  /* search form */
  public loadSearchForm() {
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
    this.searchHotelForm = this.fb.group({
      checkIn: [null, Validators.required],
      checkOut: [null, Validators.required]
    });
    let checkInObj = {
      year: parseInt(this.searchData.request.checkInDate.split("-")[0]),
      month: parseInt(this.searchData.request.checkInDate.split("-")[1]),
      day: parseInt(this.searchData.request.checkInDate.split("-")[2])
    };
    let checkOutObj = {
      year: parseInt(this.searchData.request.checkOutDate.split("-")[0]),
      month: parseInt(this.searchData.request.checkOutDate.split("-")[1]),
      day: parseInt(this.searchData.request.checkOutDate.split("-")[2])
    };
    this.searchHotelForm.patchValue({
      checkIn: checkInObj,
      checkOut: checkOutObj   
    });

    console.log(this.searchHotelForm);
  }
  /* Preparing skeleton objects */
  public generateFake(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }
  /* /preparing skeleton objects */

  ngOnInit() {}

  public onFilterDisplay() {
    this.isFilterDisplay = !this.isFilterDisplay;
  }

  public closeFilter(): void {
    this.isFilterDisplay = !this.isFilterDisplay;
  }

  public changeHotelSearch(): void {
    // checkInDay
    if (this.searchHotelForm.value.checkIn.day < 10)
      var checkInDay = `0${this.searchHotelForm.value.checkIn.day}`;
    else var checkInDay = `${this.searchHotelForm.value.checkIn.day}`;

    // checkOutDay
    if (this.searchHotelForm.value.checkIn.day < 10)
      var checkOutDay = `0${this.searchHotelForm.value.checkOut.day}`;
    else var checkOutDay = `${this.searchHotelForm.value.checkOut.day}`;

    let checkInDate =
      this.searchHotelForm.value.checkIn.year +
      "-" +
      this.searchHotelForm.value.checkIn.month +
      "-" +
      checkInDay;
    let checkOutDate =
      this.searchHotelForm.value.checkOut.year +
      "-" +
      this.searchHotelForm.value.checkOut.month +
      "-" +
      checkOutDay;

    this.searchData.request.checkInDate = checkInDate;
    this.searchData.request.checkOutDate = checkOutDate;
    // this.hotels= [];
    // this.mainHotelsList = [];
    this.getHotels();
  }

  /* Get hotels data by search object(Get from localstorage stored in search component) */
  public getHotels(): void {
    this.teejanServices.getHotelSearch(this.searchData).subscribe(
      hotelsSearchResp => {
        localStorage.setItem(
          "hotelslistrespTrackToken",
          hotelsSearchResp.headers.get("tracktoken")
        );

        if (hotelsSearchResp != undefined) {
          localStorage.setItem(
            "hotelslistrespTrackToken",
            hotelsSearchResp.headers.get("tracktoken")
          );
          localStorage.setItem(
            "hotelList",
           JSON.stringify( hotelsSearchResp.body.hotels)
          );
          this.hotels = hotelsSearchResp.body.hotels;
          this.mainHotelsList = hotelsSearchResp.body.hotels;
        } else {
          this.hotels = [];
        }

        /* Preparing filters */
        if (hotelsSearchResp != undefined) {
          this.hotels.forEach(element => {
            let temp = [];
            this.filterChains = [];
            this.hotels.forEach(function(item, index) {
              if (item.hotelChain != undefined && item.hotelChain != "") {
                if (temp != undefined) {
                  temp.push(item.hotelChain);
                }
              }
            });
            this.hasHotelChains = temp.length > 0 ? true : false;
            this.filterChains = temp;

            temp = [];
            this.filterCategories = [];
            this.hotels.forEach(function(item, index) {
              if (item.category != undefined && item.category != "") {
                if (temp != undefined) {
                  temp.push(item.category);
                }
              }
            });
            this.hasCategories = temp.length > 0 ? true : false;
            this.filterCategories = temp;

            temp = [];
            this.hotels.forEach(function(item, index) {
              if (item.amenities != undefined && item.amenities != "") {
                item.amenities.forEach(im => {
                  if (im.name != undefined && im.name != "") {
                    temp.push(im.name);
                  }
                });
              }
            });
            this.hasAmenities = temp.length > 0 ? true : false;
            this.filterAmenities = temp;

            temp = [];
            this.hotels.forEach(function(item, index) {
              if (
                item.optionalAmenities != undefined &&
                item.optionalAmenities != ""
              ) {
                item.optionalAmenities.forEach(im => {
                  if (im.name != undefined && im.name != "") {
                    temp.push(im.name);
                  }
                });
              }
            });
            this.hasRoomAmenities = temp.length > 0 ? true : false;
            this.filterRoomAmenities = temp;
          });
        }
        this.isFirstTimeLoad = false;

        this.hotels.sort((a, b) => a.amount - b.amount);
        this.minValue = this.hotels[0].amount;
        this.maxValue = this.hotels[this.hotels.length - 1].amount;
        // console.log(this.minValue, this.maxValue);

        this.options = {
          floor: this.minValue,
          ceil: this.maxValue
        };
      },
      err => {}
    );
  }

  /* Start of Hotel Filter */
  onHotelFilter(type, event, item) {
    // this.isFirstTimeLoad = false;
    this.hotels = this.mainHotelsList; //this.searchResultsTemp;
    switch (type) {
      case "RATING":
        if (event.target.checked) {
          this.selectedRating.push(item);
        } else {
          this.selectedRating.splice(this.selectedRating.indexOf(item), 1);
        }
        break;

      case "AMENITIES":
        if (event.target.checked) {
          this.selectedAmenities.push(item);
        } else {
          this.selectedAmenities.splice(
            this.selectedAmenities.indexOf(item),
            1
          );
        }

        console.log(JSON.stringify(this.selectedAmenities));
        break;

      case "LOCALITIES":
        if (event.target.checked) {
          this.selectedLocalitiesList.push(item);
        } else {
          this.selectedLocalitiesList.splice(
            this.selectedLocalitiesList.indexOf(item),
            1
          );
        }
        break;

      case "CHAINS":
        if (event.target.checked) {
          this.selectedChains.push(item);
        } else {
          this.selectedChains.splice(this.selectedChains.indexOf(item), 1);
        }
        break;

      case "PROPERTYLIST":
        if (event.target.checked) {
          this.selectedPropertyType.push(item);
        } else {
          this.selectedPropertyType.splice(
            this.selectedPropertyType.indexOf(item),
            1
          );
        }
        break;

      case "CATEGORY":
        if (event.target.checked) {
          this.selectedCategoryList.push(item);
        } else {
          this.selectedCategoryList.splice(
            this.selectedCategoryList.indexOf(item),
            1
          );
        }
        break;

      case "RMAMENITIES":
        if (event.target.checked) {
          this.selectedRoomAmenities.push(item);
        } else {
          this.selectedRoomAmenities.splice(
            this.selectedRoomAmenities.indexOf(item),
            1
          );
        }
        break;
      case "RESERVATION_POLICY":
        if (event.target.checked) {
          this.selectedReservationPolicy.push(item);
        } else {
          this.selectedReservationPolicy.splice(
            this.selectedReservationPolicy.indexOf(item),
            1
          );
        }
        break;

      default:
        break;
    }

    let temp = [];

    //Rating filter
    temp = [];
    if (this.selectedRating.length > 0) {
      for (let i = 0; i < this.selectedRating.length; i++) {
        for (let j = 0; j < this.hotels.length; j++) {
          if (this.hotels[j].rating != undefined) {
            if (
              this.hotels[j].rating == parseInt(this.selectedRating[i].name)
              // this.hotels[j].rating == this.selectedRating[i].name
            ) {
              temp.push(this.hotels[j]);
            }
          }
        }
      }
      this.hotels = temp;
    }

    //Categories Filter
    temp = [];
    if (this.selectedCategoryList.length > 0) {
      for (let i = 0; i < this.selectedCategoryList.length; i++) {
        for (let j = 0; j < this.hotels.length; j++) {
          if (this.hotels[j].category != undefined) {
            if (this.hotels[j].category === this.selectedCategoryList[i])
              temp.push(this.hotels[j]);
          }
        }
      }
      this.hotels = temp;
    }

    //Property filter
    temp = [];
    if (this.selectedPropertyType.length > 0) {
      for (let i = 0; i < this.selectedPropertyType.length; i++) {
        for (let j = 0; j < this.hotels.length; j++) {
          if (this.hotels[j].propertyType != undefined) {
            if (
              this.hotels[j].propertyType.localeCompare(
                this.selectedPropertyType[i]
              )
            )
              temp.push(this.hotels[j]);
          }
        }
      }
      this.hotels = temp;
    }

    //Chains filter
    temp = [];
    if (this.selectedChains.length > 0) {
      for (let i = 0; i < this.selectedChains.length; i++) {
        for (let j = 0; j < this.hotels.length; j++) {
          if (this.hotels[j].hotelChain != undefined) {
            if (this.hotels[j].hotelChain === this.selectedChains[i])
              temp.push(this.hotels[j]);
          }
        }
      }
      this.hotels = temp;
    }

    //Localities
    temp = [];
    if (this.selectedLocalitiesList.length > 0) {
      for (let i = 0; i < this.selectedLocalitiesList.length; i++) {
        for (let j = 0; j < this.hotels.length; j++) {
          if (this.hotels[j].location != undefined) {
            if (
              this.hotels[j].location.localeCompare(
                this.selectedLocalitiesList[i]
              )
            )
              temp.push(this.hotels[j]);
          }
        }
      }
      this.hotels = temp;
    }

    //Amenities Filter
    temp = [];
    if (this.selectedAmenities.length > 0) {
      for (let i = 0; i < this.selectedAmenities.length; i++) {
        for (let j = 0; j < this.hotels.length; j++) {
          if (this.hotels[j].amenities != undefined) {
            this.hotels[j].amenities.forEach(item => {
              if (item.name === this.selectedAmenities[i]) {
                temp.push(this.hotels[j]);
              }
            });
          }
        }
      }
      this.hotels = temp;
    }
    console.log(this.hotels.length);

    //Room Amenities Filter
    temp = [];
    if (this.selectedRoomAmenities.length > 0) {
      for (let i = 0; i < this.selectedRoomAmenities.length; i++) {
        for (let j = 0; j < this.hotels.length; j++) {
          if (this.hotels[j].optionalAmenities != undefined) {
            this.hotels[j].optionalAmenities.forEach(item => {
              if (item.name === this.selectedRoomAmenities[i]) {
                temp.push(this.hotels[j]);
              }
            });
          }
        }
      }
      this.hotels = temp;
    }
    //ReservationPolicy Filter
    temp = [];
    if (this.selectedReservationPolicy.length > 0) {
      for (let i = 0; i < this.selectedReservationPolicy.length; i++) {
        for (let j = 0; j < this.hotels.length; j++) {
          if (this.hotels[j].reservationPolicy != undefined) {
            if (
              this.hotels[j].reservationPolicy.includes(
                this.selectedReservationPolicy[i]
              ) > -1
            ) {
              temp.push(this.hotels[j]);
            }
          }
        }
      }
      this.hotels = temp;
    }
    this.hotels.sort((a, b) => a.amount - b.amount);
  }
  /* End of Hotel Filter */

  /* Clearing Filters*/
  clearFilter(type) {
    switch (type) {
      case "RATING":
        this.selectedRating = [];
        this.onHotelFilter("", "", "");
        this.ratingCheckbox.forEach(element => {
          element.nativeElement.checked = false;
        });
        break;

      case "AMENITIES":
        this.selectedAmenities = [];
        this.onHotelFilter("", "", "");
        this.amenitiesCheckbox.forEach(element => {
          element.nativeElement.checked = false;
        });
        break;

      case "LOCALITIES":
        this.selectedLocalitiesList = [];
        this.onHotelFilter("", "", "");
        this.locationsCheckbox.forEach(element => {
          element.nativeElement.checked = false;
        });
        break;

      case "CHAINS":
        this.selectedChains = [];
        this.onHotelFilter("", "", "");
        this.chainsCheckbox.forEach(element => {
          element.nativeElement.checked = false;
        });
        break;

      case "PROPERTYLIST":
        this.selectedPropertyType = [];
        this.onHotelFilter("", "", "");
        this.propertyTypeCheckbox.forEach(element => {
          element.nativeElement.checked = false;
        });
        break;

      case "CATEGORY":
        this.selectedCategoryList = [];
        this.onHotelFilter("", "", "");
        this.CategoryCheckbox.forEach(element => {
          element.nativeElement.checked = false;
        });
        break;

      case "HOTELNAME":
        this.name_filter = "";
        // this.onHotelFilter("", "", "");
        break;

      case "HOTELADDRESS":
        this.address_filter = "";
        // this.onHotelFilter("", "", "");
        break;

      case "RMAMENITIES":
        this.selectedRoomAmenities = [];
        this.onHotelFilter("", "", "");
        this.amenitiesCheckbox.forEach(element => {
          element.nativeElement.checked = false;
        });
        break;

      case "RESERVATION_POLICY":
        this.selectedReservationPolicy = [];
        this.onHotelFilter("", "", "");
        this.RPCheckbox.forEach(element => {
          element.nativeElement.checked = false;
        });
        break;

      default:
        break;
    }
  }

  /* sort hotels method*/
  sortHotels(sortType, subType) {
    if (sortType === "name") {
      if (subType === "org" || subType === "z-a") {
        this.sortType[0]["subtype"] = "a-z";
        this.sortType[0]["icon"] = "fa fa-angle-up";
        this.hotels.sort((a, b) => a.name.localeCompare(b.name));
      } else if (subType === "a-z") {
        this.sortType[0]["subtype"] = "z-a";
        this.sortType[0]["icon"] = "fa fa-angle-down";
        this.hotels.sort((a, b) => b.name.localeCompare(a.name));
      } else if (subType === "z-a") {
        this.sortType[0]["subtype"] = "a-z";
        this.sortType[0]["icon"] = "fa fa-angle-up";
        this.hotels.sort((a, b) => a.name.localeCompare(b.name));
      }
    } else if (sortType === "rating") {
      if (subType === "org") {
        this.sortType[1]["icon"] = "fa fa-angle-up";
        this.sortType[1]["subtype"] = "de";
        this.hotels.sort((a, b) => b.rating - a.rating);
      } else if (subType === "de") {
        this.sortType[1]["icon"] = "fa fa-angle-down";
        this.sortType[1]["subtype"] = "in";
        this.hotels.sort((a, b) => a.rating - b.rating);
      } else if (subType === "in") {
        this.sortType[1]["icon"] = "fa fa-angle-up";
        this.sortType[1]["subtype"] = "de";
        this.hotels.sort((a, b) => b.rating - a.rating);
      }
    } else if (sortType === "price") {
      if (subType === "org") {
        this.sortType[2]["icon"] = "fa fa-angle-up";
        this.sortType[2]["subtype"] = "priceDecrement";
        this.hotels.sort((a, b) => b.amount - a.amount);
      } else if (subType === "priceDecrement") {
        this.sortType[2]["icon"] = "fa fa-angle-down";
        this.sortType[2]["subtype"] = "priceIncrement";
        this.hotels.sort((a, b) => a.amount - b.amount);
      } else if (subType === "priceIncrement") {
        this.sortType[2]["icon"] = "fa fa-angle-up";
        this.sortType[2]["subtype"] = "priceDecrement";
        this.hotels.sort((a, b) => b.amount - a.amount);
      }
    }
  }
  /* /sort hotels method */

  /* Navigate to hotel details page by select any room */
  public onHotelDetails(hotel): void {
    localStorage.setItem("currentHotel", JSON.stringify(hotel));
    if (document.location.href.toString().includes("b2b")) {
      this.router.navigateByUrl("b2b/hoteldetails");
    } else {
      this.router.navigateByUrl("b2c/hoteldetails");
    }
  }

  /* Views Switching */
  public onViewSwitching() {
    this.isViewChange = !this.isViewChange;
  }

  /* price slider change event */
  public priceSliderChange(event): void {
    let temp = [];
    this.hotels = [];
    this.hotels.forEach(element => {
      if (element.amount > event.value && element.amount < event.highValue) {
        temp.push(element);
      }
    });
    if (temp.length > 0) this.hotels = temp;
  }

  /* change value of items per page in pagination */
  public onChangeItemsPerpage(itemsPerPageVal): void {
    this.itemsPerPage = itemsPerPageVal;
  }

  /* show filter section in mobile */
  public showFilter(): void {
    console.log("showFilter method");
  }
}
