import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AlrajhiumrahService } from "src/app/services/alrajhiumrah.service";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

import { Options, LabelType } from "ng5-slider";
import swal from "sweetalert2";
import { BroadcastserviceService } from "src/app/services/broadcastservice.service";

@Component({
  selector: "app-transport-service",
  templateUrl: "./transport-service.component.html",
  styleUrls: ["./transport-service.component.scss"]
})
export class TransportServiceComponent implements OnInit {
  public transportSearckTrackToken: any;
  public tranportFormGroup: FormGroup;
  public transportSearchObj: any;
  public transportSearchResponse = [];
  public tansportCompany = [];
  public tranportCategories = [];
  public additionalServices = [];
  public vehicleTypes = [];
  public vehicleTypesList = [];
  public vehicleArray = [];
  public selectedVehicle = [];
  public vehicelcapcityObj = {};
  public vehicelQuntityObj = {};
  public taxAmount = 0;
  public feeAmount = 0;
  public cartVehicleList = [];
  public routes = [];
  public companies = [];
  public searchDate: any;
  public transportList = [];
  // public transportLists : any
  public page = 1;
  public transport_name_filter: string;
  public isTransportListAvailableFlag: boolean = true;
  public transportAvailabilityFlag: boolean;
  public noOfPax: Number = 0;

  sortType = [
    {
      type: "name",
      displayName: "Name",
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

  public modelDates = [
    { name: "2009" },
    { name: "2010" },
    { name: "2011" },
    { name: "2012" },
    { name: "2013" },
    { name: "2014" },
    { name: "2015" },
    { name: "2016" },
    { name: "2017" },
    { name: "2018" },
    { name: "2019" }
  ];
  public searchFilterObj: any;
  public isFirstTimeLoad: boolean = true;

  transportAvailability: any;
  public transportCurrency = ["SAR", "INR"];

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
  public isFilterDisplay: boolean = false;
  mainTransportList: any;
  constructor(
    private router: Router,
    private teejanServices: AlrajhiumrahService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private broadcastService: BroadcastserviceService
  ) {
    this.searchDate = JSON.parse(localStorage.getItem("searchObj"));
    this.searchFilterObj = JSON.parse(localStorage.getItem("searchFilterObj"));

    this.noOfPax =
      parseInt(this.searchFilterObj.adults_count) +
      parseInt(this.searchFilterObj.child_count);

    this.getTransportLookUp();
    this.loadTransportFormGroup();
    this.broadcastService.customStepper.emit(true);
  }

  ngOnInit() {}

  public onFilterDisplay() {
    this.isFilterDisplay = !this.isFilterDisplay;
  }

  public closeFilter(): void {
    this.isFilterDisplay = !this.isFilterDisplay;
  }

  /* load transport form group */
  public loadTransportFormGroup(): void {
    this.tranportFormGroup = this.fb.group({
      routeCode: [null],
      categoryCode: [null],
      quantity: [null],
      noOfPax: [null],
      vehicleTypeCode: [null],
      additionalServices: [null],
      checkin: [null]
    });
    this.bindTransportFilterData();
  }

  vehicleType(vehicle){
    console.log("vehicle" , vehicle);
    let searchFilterData : any = JSON.parse(localStorage.getItem('searchFilterObj'))

    searchFilterData.vehicleType = vehicle
   
    localStorage.setItem("searchFilterObj" , JSON.stringify(searchFilterData))
    
  }
  transportaionClass(transportionClass){

    let searchFilterData : any = JSON.parse(localStorage.getItem('searchFilterObj'))

    searchFilterData.tranportationClass = transportionClass
   
    localStorage.setItem("searchFilterObj" , JSON.stringify(searchFilterData))

  }
  transportAddtionalService(service){
    let searchFilterData : any = JSON.parse(localStorage.getItem('searchFilterObj'))

    searchFilterData.transportAdditionalServices = service
   
    localStorage.setItem("searchFilterObj" , JSON.stringify(searchFilterData))

  }

  /* Get traport look up data */
  public getTransportLookUp(): void {
    this.teejanServices.getTransportLookup().subscribe(
      transportLookUpResp => {
        this.vehicleTypes = JSON.parse(
          transportLookUpResp.vehicletypes
        ).vehicleTypes;
        this.additionalServices = JSON.parse(
          transportLookUpResp.additionalservices
        ).additionalServices;
        this.tranportCategories = JSON.parse(
          transportLookUpResp.categories
        ).categories;
        this.routes = JSON.parse(transportLookUpResp.routes).routes;
        this.companies = JSON.parse(transportLookUpResp.companies).companies;
      },
      err => {}
    );
  }

  /* bind transport data which is taken from search component to filter */
  public bindTransportFilterData(): void {
    this.tranportFormGroup.patchValue({
      routeCode: this.searchFilterObj.route,
      categoryCode: this.searchFilterObj.tranportationClass,
      quantity: this.searchFilterObj.vehicleQuantity,
      additionalServices : this.searchFilterObj.transportAdditionalServices != null ?this.searchFilterObj.transportAdditionalServices.name :null,
      noOfPax:
        parseInt(this.searchFilterObj.adults_count) +
        parseInt(this.searchFilterObj.child_count),
      vehicleTypeCode: this.searchFilterObj.vehicleType,
      checkin:
        this.searchFilterObj.checkIn.year +
        "-" +
        this.searchFilterObj.checkIn.month +
        "-" +
        this.searchFilterObj.checkIn.day
    });
    // console.log(JSON.stringify(this.tranportFormGroup.value));
    this.onTranportSearch();
  }

  /* tranport search menthod */
  public onTranportSearch(): void {
    this.spinner.show();
    this.isTransportListAvailableFlag = true;
    this.transportSearchObj = {
      context: {
        cultureCode: this.searchDate.context.cultureCode
      },
      request: {
        routeCode: this.tranportFormGroup.value.routeCode.code,
        startDate: this.tranportFormGroup.value.checkin,
        categoryCode : this.tranportFormGroup.value.categoryCode != null ? this.tranportFormGroup.value.categoryCode.code:null,
        quantity: parseInt(this.searchFilterObj.vehicleQuantity),
        noOfPax: this.noOfPax,
        // model: {
        //     from : this.tranportFormGroup.value.from,
        //     to : this.tranportFormGroup.value.to
        //  }, 
         vehicleTypeCode: this.tranportFormGroup.value.vehicleTypeCode != null ? this.tranportFormGroup.value.vehicleTypeCode.code:null,
         additionalServices: this.tranportFormGroup.value.additionalServices!=null?[this.searchFilterObj.transportAdditionalServices.code]:null
      }
    };
    console.log(JSON.stringify(this.transportSearchObj.request));
     if(this.transportSearchObj.request.categoryCode == null){
       delete this.transportSearchObj.request.categoryCode
     }

     if(this.transportSearchObj.request.vehicleTypeCode == null){
         delete this.transportSearchObj.request.vehicleTypeCode
     }

     if(this.tranportFormGroup.value.additionalServices == null){
         delete this.transportSearchObj.request.additionalServices
     }


    localStorage.setItem(
      "transportSearch",
      JSON.stringify(this.transportSearchObj)
    );
    this.teejanServices.getTransportSearch(this.transportSearchObj).subscribe(
      transportSearchResp => {
        
       this.spinner.hide();
        if (transportSearchResp.body.transportations.length > 0) {
          transportSearchResp.body.transportations.forEach(transportation => {
            this.companies.forEach(company => {
              if (transportation.companyCode === company.code) {
                transportation["companyName"] = company.name;
                transportation["companyDescription"] = company.description;
                transportation["companyAddress"] = company.address;
              }
            });
          });
          this.transportList = transportSearchResp.body.transportations;
          this.mainTransportList = transportSearchResp.body.transportations;

          this.transportList.sort((a, b) => a.amount - b.amount);
          this.minValue = this.transportList[0].vehicleTypes[0].categories[0].displayRateInfo[0].amount;
          this.maxValue = this.transportList[
            this.transportList.length - 1
          ].vehicleTypes[0].categories[0].displayRateInfo[0].amount;
          // console.log(this.minValue, this.maxValue);

          this.options = {
            floor: this.minValue,
            ceil: this.maxValue
          };

          localStorage.setItem(
            "transportSearchResponse",
            JSON.stringify(this.transportList)
          );
          localStorage.setItem(
            "transportSearchTrackToken",
            transportSearchResp.headers.get("tracktoken")
          );
          this.isFirstTimeLoad = false;
        }
      },
      err => {}
    );
  }

  /* search again if no data found from transport search api */
  public searchAgain(): void {}

  /* call transport availability api by click on view details of transport list item */
  public onTransportationAvailability(currentTransport): void {
      

    this.spinner.show();
    this.isTransportListAvailableFlag = false;

    this.transportSearckTrackToken = localStorage.getItem(
      "transportSearchTrackToken"
    );

    let quantity = parseInt(this.searchFilterObj.vehicleQuantity);

      
    if( currentTransport.vehicleTypes != undefined ||  currentTransport.vehicleTypes != null){

    for (let i = 0; i < currentTransport.vehicleTypes.length; i++) {
      this.vehicleTypesList = currentTransport.vehicleTypes[i].categories.map(
        item => {
          delete item.availableQuantity;
          delete item.maxPaxCapacity;
          return item;
        }
      );

      this.vehicleTypesList = currentTransport.vehicleTypes[i].categories.map(
        item => {
          let o = Object.assign({}, item);
          o.images = [];
          o.config = [];
          o.quantity = quantity;
          o.noOfPax = this.noOfPax;
          o.termsAndConditions = currentTransport.termsAndConditions;
          return o;
        }
      );

      var vehicleObj = {
        categories: this.vehicleTypesList,
        vehicleTypeCode: currentTransport.vehicleTypes[i].vehicleTypeCode
      };
      this.vehicleArray.push(vehicleObj);
    }
  }

    //add description in policeis

    if(currentTransport.policies != undefined || currentTransport.policeis != null){

    var policies = currentTransport.policies.map(item => {
      let o = Object.assign({}, item);
      o.description = "";
      return o;
    });
  }

    let formData = {
      context: {
        cultureCode: this.searchDate.context.cultureCode,
        trackToken: this.transportSearckTrackToken,
        providerInfo: [
          {
            provider: currentTransport.provider
          }
        ]
      },
      request: {
        companyCode: currentTransport.companyCode,
        routeCode: currentTransport.routeCode,
        startDate: this.searchDate.request.checkInDate,
        vendor: currentTransport.provider,
        provider: currentTransport.provider,
        vehicleTypes: this.vehicleArray,
        policies: policies,
        termsAndConditions: currentTransport.termsAndConditions,
        config: []
      }
    };

    

    this.teejanServices.getTransportAvailability(formData).subscribe(
      resp => {
    

        this.spinner.hide();
        if (resp.body.vehicleTypes != undefined) {
          this.transportAvailabilityFlag = true;

          resp.body.vehicleTypes.forEach(vehicle => {
            vehicle.categories[0].displayRateInfo.forEach(displayRate => {
              // adding GDS and OTA TAXES with baseprice
              if (displayRate.purpose == "1") {
                let GDSobject = {
                  amount: (displayRate.amount / 100) * 7.5,
                  purpose: "20",
                  description: "GDSTAX",
                  currencyCode: "SAR"
                };
                vehicle.categories[0].displayRateInfo.push(GDSobject);
                let OTAobject = {
                  amount: (displayRate.amount / 100) * 30,
                  purpose: "30",
                  description: "OTATAX",
                  currencyCode: "SAR"
                };
                vehicle.categories[0].displayRateInfo.push(OTAobject);

                // calculating all taxes (OTA + GDS + VAT(TAX) + FEES)
                if (displayRate.purpose == "7") {
                  this.taxAmount = 0;
                  this.taxAmount = displayRate.amount;
                }
                if (displayRate.purpose == "2") {
                  this.feeAmount = 0;
                  this.feeAmount = displayRate.amount;
                }

                let taxesObject = {
                  amount:
                    (displayRate.amount / 100) * 30 +
                    (displayRate.amount / 100) * 7.5 +
                    this.taxAmount +
                    this.feeAmount,
                  purpose: "40",
                  description: "TAXES",
                  currencyCode: "SAR"
                };
                vehicle.categories[0].displayRateInfo.push(taxesObject);
              }
            });
          });

          this.transportSearchResponse = JSON.parse(
            localStorage.getItem("transportSearchResponse")
          );

          this.tansportCompany = [];
          this.transportAvailability = resp.body;

          this.tansportCompany = this.transportSearchResponse.filter(
            res => res.companyCode === this.transportAvailability.companyCode
          );
          for (
            var i = 0;
            i < this.tansportCompany[0].vehicleTypes.length;
            i++
          ) {
            for (
              var j = 0;
              j < this.transportAvailability.vehicleTypes.length;
              j++
            ) {
              if (
                this.tansportCompany[0].vehicleTypes[i].vehicleTypeCode ==
                this.transportAvailability.vehicleTypes[j].vehicleTypeCode
              ) {
                for (
                  var k = 0;
                  k < this.tansportCompany[0].vehicleTypes[i].categories.length;
                  k++
                ) {
                  for (
                    var l = 0;
                    l <
                    this.transportAvailability.vehicleTypes[j].categories
                      .length;
                    l++
                  ) {
                    if (
                      this.tansportCompany[0].vehicleTypes[i].categories[k]
                        .categoryCode ==
                      this.transportAvailability.vehicleTypes[j].categories[l]
                        .categoryCode
                    ) {
                      const vehicleCapacity = Array(
                        this.tansportCompany[0].vehicleTypes[i].categories[k]
                          .maxPaxCapacity
                      )
                        .fill(+0)
                        .map((x, i) => i);
                      const vehicleAvailableQuantity = Array(
                        this.tansportCompany[0].vehicleTypes[i].categories[k]
                          .availableQuantity
                      )
                        .fill(+0)
                        .map((x, i) => i);
                      this.transportAvailability.vehicleTypes[j].categories[l][
                        "maxPaxCapacity"
                      ] = vehicleCapacity;
                      this.transportAvailability.vehicleTypes[j].categories[l][
                        "availableQuantity"
                      ] = vehicleAvailableQuantity;
                    }
                  }
                }
              }
            }
          }

          localStorage.setItem(
            "transportAvailabilityTracktoken",
            resp.headers.get("tracktoken")
          );
          localStorage.setItem(
            "transportAvailability",
            JSON.stringify(resp.body)
          );
        } else {
          this.spinner.hide();
          this.transportAvailabilityFlag = false;
          setTimeout(() => {
            this.onTranportSearch();
          }, 5000);
        }
      },
      err => {}
    );
  }

  // calling transportlist
  backToTransportList() {
    this.onTranportSearch();
  }

  // select capacity
  vehicleMaxCapacity(capacity, vehicle, veIndex) {

    vehicle.categories[0]["noOfPax"] = parseInt(capacity);

    this.vehicelcapcityObj = {
      quantity: "0",
      capacity: capacity,
      vehicle: vehicle,
      veIndex: veIndex
    };
    let index = this.selectedVehicle.findIndex(veh => veh.veIndex == veIndex);

    if (index == -1) {
      this.selectedVehicle.push(this.vehicelcapcityObj);
    } else {
      if (capacity == "0" || capacity == undefined) {
        if (this.selectedVehicle[index].quantity == "0" || this.selectedVehicle[index].quantity == undefined) {
          this.selectedVehicle.splice(index, 1);
        }else{
            this.selectedVehicle[index].capacity = 0
        }
      } else {

        this.selectedVehicle[index].capacity = capacity;
      }
    }
  

  }

  // select vehicle quntity
  vehicleAviQty(quantity, vehicle, veIndex) {

    vehicle.categories[0]["quantity"] = parseInt(quantity);

    this.vehicelQuntityObj = {
      capacity: "0",
      quantity: quantity,
      vehicle: vehicle,
      veIndex: veIndex
    };
    let index = this.selectedVehicle.findIndex(veh => veh.veIndex == veIndex);

    if (index == -1) {
      this.selectedVehicle.push(this.vehicelQuntityObj);
    } else {
      if (quantity == "0" || quantity == undefined) {
 
        if (this.selectedVehicle[index].capacity == "0" || this.selectedVehicle[index].capacity == undefined) {
          this.selectedVehicle.splice(index, 1);
        }else{
             this.selectedVehicle[index].quantity = 0
        }
      } else {
      
        this.selectedVehicle[index].quantity = quantity;
      }
    }

  
  }

  /* navigate to ground service */
  onGroundService(selectTransPort) {
    let noOfPax =
      parseInt(this.searchFilterObj.adults_count) +
      parseInt(this.searchFilterObj.child_count);

    this.cartVehicleList = [];

    if (this.selectedVehicle.length > 0) {
  
      for (let i = 0; i < this.selectedVehicle.length; i++) {
        if (
          this.selectedVehicle[i].quantity == "0" ||
          this.selectedVehicle[i].capacity == "0"
        ) {
          // alert("select capacity and quantity of same transportation option.");

          swal.fire({
            title:
              "select capacity and quantity of same transportation option.",
            showClass: {
              popup: "animated fadeInDown faster"
            },
            hideClass: {
              popup: "animated fadeOutUp faster"
            }
          });
          break;
        } else {
          this.cartVehicleList.push(this.selectedVehicle[i].vehicle);
        }
      }
      if (this.cartVehicleList.length == this.selectedVehicle.length) {
        const totalPax = this.cartVehicleList.reduce(
          (a, b) => a + b.categories[0].noOfPax,
          0
        );
        // validating
        if (totalPax == noOfPax) {
          selectTransPort["vehicleTypes"] = this.cartVehicleList;
          localStorage.setItem(
            "transportcart",
            JSON.stringify(selectTransPort)
          );
          swal.fire({
            position: 'top-end',
            icon: 'success',
            width: '22em',
            title: 'Added to the cart',
            showConfirmButton: false,
            timer: 3000
          })
  
          if (document.location.href.toString().includes("b2b")) {
            this.router.navigateByUrl("b2b/ground");
          } else {
            this.router.navigateByUrl("b2c/ground");
          }
        } else {
        
          swal.fire({
            title: "Please select vehicle as per your pax capacity.",
            showClass: {
              popup: "animated fadeInDown faster"
            },
            hideClass: {
              popup: "animated fadeOutUp faster"
            }
          });
        }
      }
    } else {
    
      swal.fire({
        title: "Please select vehicle with quantity.",
        showClass: {
          popup: "animated fadeInDown faster"
        },
        hideClass: {
          popup: "animated fadeOutUp faster"
        }
      });
    }
  }
 
  skipGroundService(){
    if (document.location.href.toString().includes("b2b")) {
      this.router.navigateByUrl("b2b/ground");
    } else {
      this.router.navigateByUrl("b2c/ground");
    }
  }

  /* Generate skeletons for transport list */
  public generateTransportSkeletons(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  /* price slider change event */
  public priceSliderChange(event): void {
    let temp = [];
    this.transportList = [];
    this.mainTransportList.forEach(element => {
      if (
        element.vehicleTypes[0].categories[0].displayRateInfo[0].amount >=
          event.value &&
        element.vehicleTypes[0].categories[0].displayRateInfo[0].amount <=
          event.highValue
      ) {
        temp.push(element);
      }
    });
    if (temp.length > 0) this.transportList = temp;
    console.log("transportLength" , this.transportList.length)
  }

   
  public clearFilter(filterName): void {
    switch (filterName) {
      case "name":
        this.transport_name_filter = "";
        break;

      default:
        break;
    }
  }
}
