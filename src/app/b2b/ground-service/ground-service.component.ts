import { Component, OnInit, ViewChild } from "@angular/core";
import { AlrajhiumrahService } from 'src/app/services/alrajhiumrah.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';
import { Options, LabelType } from "ng5-slider";
import { DropdownDirective, TOGGLE_STATUS } from 'angular-custom-dropdown';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: "app-ground-service",
  templateUrl: "./ground-service.component.html",
  styleUrls: ["./ground-service.component.scss"]
})
export class GroundServiceComponent implements OnInit {

  @ViewChild('myDropdown') myDropdown: DropdownDirective;

  public searchData: any = {};
  public countriesList: any[] = [];
  // public groundResultsNotFound: boolean;
  public isFirstTimeLoad: boolean = true;
  public groundServiceList = [];
  public groundViewDetails: any;
  public isGroundAvailabilty: boolean = false
  public categories = [];
  public additionalServices = [];
  public companies = [];
  public GroundServicesFormGroup: FormGroup;
  public GroundServicesValidationFlag: boolean;
  public companyCode = '';
  public keyword = 'name';
  public addService = [];
  public countryList = [];
  public myForm: FormGroup;
  public formArrayLength: any;
  public groundServiceAvailability: any = {}
  public groundServiceTrackToken: any
  public isGroundServicesAvailableFlag: boolean = true;
  public groundservice_name_filter: string;
  public taxAmount = 0
  public feeAmount = 0

  public additionalSerBaseAmount = 0
  public additionalSerBaseAmountWithTax = 0
  public additionalSerVatAmount = 0



  /*Ground Currencies*/

  public groundCurrencies = ["SAR", "INR"];
  /*Ground Currencies*/

  /* Price Range */
  minValue: number = 0;
  maxValue: number = 0;
  options: Options = {
    floor: 0,
    ceil: 0,
    translate: (value: number, label: LabelType): string => {
      /*  switch (label) {
         case LabelType.Low:
           return "SAR" + value;
         case LabelType.High:
           return "SAR" + value;
         default:
           return "$" + value;
       } */
      return "SAR";
    }
  };
  /* Price Range */

  /* Sorting object */
  sortType = [
    {
      type: "name",
      displayName: "Hotel Name",
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
  searchFilterObj: any;
  public isFilterDisplay: boolean = false;
  priceChangeMinValue: any;
  priceChangeMaxValue: any;
  mainGroundServiceList: any;
  disableTextbox: boolean;
  currentIndex: any;
  checkedAdditionalservices = [];
  selectAdditionalServices = [];

  constructor(private router: Router, private teejanServices: AlrajhiumrahService, private spinner: NgxSpinnerService,
    private fb: FormBuilder, ) { }

  ngOnInit() {
    this.getGroundServicesLookup();
    this.searchData = JSON.parse(localStorage.getItem("searchObj"));
    this.searchFilterObj = JSON.parse(localStorage.getItem("searchFilterObj"));
    this.loadGroundSericeFilterForm();
    this.country();

    this.myDropdown.statusChange()
      .subscribe((status: TOGGLE_STATUS) => {
        let statusValue: String;
        if (status === TOGGLE_STATUS.OPEN) {
          statusValue = 'Opened';
        } else if (status === TOGGLE_STATUS.CLOSE) {
          statusValue = 'Closed';
        }
        console.info(`Dropdown status changed to "${statusValue}".`);
      });
  }



  public getGroundServicesLookup(): void {
    this.teejanServices.getGroundServiceLookup().subscribe((groundServiceLookUpResp) => {
      if (groundServiceLookUpResp.categories != "") {
        this.categories = JSON.parse(
          groundServiceLookUpResp.categories
        ).categories;
      } else {
        this.categories = [];
      }

      if (groundServiceLookUpResp.uocompanies != "") {
        this.companies = JSON.parse(
          groundServiceLookUpResp.uocompanies
        ).uocompanies;
      } else {
        this.companies = [];
      }

      if (groundServiceLookUpResp.additionalservices != "") {
        this.additionalServices = JSON.parse(groundServiceLookUpResp.additionalservices).additionalServices;
        console.log("service", this.additionalServices)
      } else {
        this.additionalServices = [];
      }
      this.onGroundServicesSearch();
      this.patchValues();
    }, (err) => {
    })
  }

  isInputChecked(i, event) {
    // this.currentIndex = i;
    console.log("event---", event);

    if (event.target.checked) {
      this.currentIndex = i;
      this.checkedAdditionalservices.push(i);
      console.log("checkedAdditionalservices", this.checkedAdditionalservices)
    } else {
      // console.log("checkedAdditionalservices11111" , this.checkedAdditionalservices)
      for (let m = 0; m < this.checkedAdditionalservices.length; m++) {
        if (this.checkedAdditionalservices[m] === i) {
          console.log("checkedAdditionalservices[m]", this.checkedAdditionalservices[m])

          this.checkedAdditionalservices.splice(m, 1)
        }
      }

      this.selectAdditionalServices.forEach((service, index) => {

        if (service.index == i) {
          this.selectAdditionalServices.splice(index, 1)
        }

      })

      console.log("checkedAdditionalservices2222", this.checkedAdditionalservices)
      console.log("selectAdditionalServices", this.selectAdditionalServices)


    }

  }

  additionalServiceQuantity(serviceObj, serviceIndex, quantity) {
    console.log("serviceObj , value", serviceObj, quantity)

    let obj = {
      index: serviceIndex,
      code: serviceObj.code,
      quantity: quantity,
      duration: ""
    }

    let index = this.selectAdditionalServices.findIndex(service => service.index == serviceIndex);

    if (index == -1) {
      this.selectAdditionalServices.push(obj)

    } else {

      this.selectAdditionalServices[index].quantity = quantity

    }

    console.log("selectAdditionalServicesQuantity", this.selectAdditionalServices);
  }
  additionalServiceDuration(serviceObj, serviceIndex, duration) {

    let obj = {
      index: serviceIndex,
      code: serviceObj.code,
      quantity: "",
      duration: duration
    }
    console.log("this.selectAdditionalServices", this.selectAdditionalServices)
    let index = this.selectAdditionalServices.findIndex(service => service.index == serviceIndex);
    console.log("index", index)
    if (index == -1) {
      this.selectAdditionalServices.push(obj)

    } else {

      this.selectAdditionalServices[index].duration = duration

    }

    console.log("selectAdditionalServicesDuration", this.selectAdditionalServices);

  }
  // change groundServicePackageClass
  GroundServiceClass(groundServiceClass) {


    let searchFilterData: any = JSON.parse(localStorage.getItem('searchFilterObj'))

    searchFilterData.groundServicePackage = groundServiceClass

    localStorage.setItem("searchFilterObj", JSON.stringify(searchFilterData))
  }

  public onFilterDisplay() {
    this.isFilterDisplay = !this.isFilterDisplay;
  }

  public closeFilter(): void {
    this.isFilterDisplay = !this.isFilterDisplay;
  }

  // get countries list
  public country(): void {
    this.teejanServices.getCountyList().subscribe((data) => {
      this.countriesList = data;
    })
  }

  public loadGroundSericeFilterForm(): void {
    this.GroundServicesFormGroup = this.fb.group({
      companyCode: [null, Validators.required],
      categoryCode: [null, Validators.required],
      additionalServices: [null, Validators.required],
      noOfPax: [""],
      // quantity: [""],
      arrivalDate: [""],
      nationality: [null, Validators.required],

      countryOfResidence: [null, Validators.required],
      rows: this.fb.array([]),
    });
    this.bindGroundServiceFilterData();
  }

  /* Bind search filter data like checkIn /noPax */
  public bindGroundServiceFilterData(): void {
    this.isGroundAvailabilty = true
    this.GroundServicesFormGroup.patchValue({
      nationality: this.searchFilterObj.nationality.countryName,
      countryOfResidence: this.searchFilterObj.countryOfResidence.countryName,
      noOfPax: parseInt(this.searchFilterObj.adults_count) + parseInt(this.searchFilterObj.child_count),
      arrivalDate: this.searchFilterObj.checkIn.year + "-" + this.searchFilterObj.checkIn.month + "-" + this.searchFilterObj.checkIn.day,
      categoryCode: this.searchFilterObj.groundServicePackage
    })

  }

  /* call ground service search api */
  public onGroundServicesSearch(): void {


    // remove index Key and filter 
    let groundAddionalSer = this.selectAdditionalServices.map(function (item) {
      delete item.index;
      return item;
    }).filter(item => { return item.quantity != "" && item.duration != "" });


    console.log("groundAddionalSer", groundAddionalSer)
    console.log(" this.GroundServicesFormGroup.value", this.GroundServicesFormGroup.value)


    let formData = {
      "context": {
        "cultureCode": this.searchData.context.cultureCode,
      },
      "request": {
        // "uoCodes": ["1039"],
        "categoryCode": this.GroundServicesFormGroup.value.categoryCode != null ? this.GroundServicesFormGroup.value.categoryCode.code : null,
        "nationality": this.searchFilterObj.nationality.countryCode,
        "countryOfResidence": this.searchFilterObj.countryOfResidence.countryCode,
        "arrivalDate": this.searchData.request.checkInDate,
        "quantity": this.GroundServicesFormGroup.value.noOfPax,
        // "additionalServices": [{ code: this.GroundServicesFormGroup.value.additionalServices != null ? this.GroundServicesFormGroup.value.additionalServices.code : null, quantity: "1", duration: "5" }]
        additionalServices: groundAddionalSer
      }
    }
    console.log("groundForm", formData)
    if (formData.request.additionalServices.length == 0) {
      delete formData.request.additionalServices
    }
    if (formData.request.categoryCode == null) {
      delete formData.request.categoryCode
    }
    this.teejanServices.getGroundServiceSearch(formData).subscribe((resp) => {
      this.spinner.hide();
      this.isFirstTimeLoad = false;
      localStorage.setItem("groundServiceTrackToken", resp.headers.get('tracktoken'))
      if (resp.body.groundServices != undefined) {
        if (this.companies != undefined) {
          this.companies.forEach(comapny => {
            resp.body.groundServices.forEach(groundCompany => {
              if (comapny.code === groundCompany.uoCode) {
                groundCompany.companyName = comapny.name
                groundCompany.comapnyDescription = comapny.description
                groundCompany.address = comapny.address
                groundCompany.images = comapny.images
                groundCompany.category.address = comapny.address
                groundCompany.category.phone = comapny.phone
                groundCompany.category.email = comapny.email

              }

            })
          })
        }

      }

      this.groundServiceList = resp.body.groundServices
      console.log("this.groundServiceList", this.groundServiceList)
      if (this.additionalServices != undefined) {

        this.additionalServices.forEach(addService => {
          this.groundServiceList.forEach(groundCompany => {

            if (groundCompany.additionalServices != undefined) {

              groundCompany.additionalServices.forEach(service => {
                if (addService.code == service.code) {
                  service.serviceName = addService.name
                }

              })

          
            }
          })
        })

      }

      if (this.groundServiceList[0].category != undefined)
        this.mainGroundServiceList = resp.body.groundServices
      this.groundServiceList.sort((a, b) => a.category.displayRateInfo[0].amount - b.category.displayRateInfo[0].amount)
      this.minValue = this.groundServiceList[0].category.displayRateInfo[0].amount;
      this.maxValue = this.groundServiceList[
        this.groundServiceList.length - 1
      ].category.displayRateInfo[0].amount;
      this.options = {
        floor: this.minValue,
        ceil: this.maxValue
      };

    }, (err) => {

    })


  }

  onGroundServices() {
    this.spinner.show();
    this.onGroundServicesSearch();
  }

  patchValues() {
    let rows = this.GroundServicesFormGroup.get('rows') as FormArray;
    this.additionalServices.forEach(x => {
      rows.push(this.fb.group({
        checkbox_value: null,
        name: x.name,
        code: x.code,
        quantity: [null],
        duration: [null]
      }));
      this.formArrayLength++;
    })
  }

  /* Generate skeletons for ground service list */
  public generateGroundServiceSkeletons(count: number): Array<number> {
    const indexes = [];
    for (let i = 0; i < count; i++) {
      indexes.push(i);
    }
    return indexes;
  }

  public onGroundServiceViewDetails(groundService): void {
    this.isGroundServicesAvailableFlag = false;
    this.categories.forEach(category => {
      if (category.code === groundService.category.categoryCode) {
        groundService.category.categoryName = category.name
      }
    })
    this.groundViewDetails = groundService
  }

  /* calculating ground service taxes */
  public getGroundServicesTaxes(displayRateInfo , additionalServices): any {
    // console.log("displayRateInfo , additionalServices" , displayRateInfo , additionalServices)
    let baseAmount = 0;
    let vatAmount = 0;
    let feesAmount = 0;

    this.additionalSerBaseAmount = 0
    this.additionalSerBaseAmountWithTax = 0
    this.additionalSerVatAmount = 0
 


    displayRateInfo.forEach(displayRate => {
      if (displayRate.purpose == "1")
        baseAmount = displayRate.amount;
      if (displayRate.purpose == "7")
        vatAmount = displayRate.amount
      if (displayRate.purpose == "2")
        feesAmount = displayRate.amount
    })


    if(additionalServices != undefined){

             
      additionalServices.forEach(service =>{

        var  addBaseAmount = 0  
        var  addTaxamount = 0
        var addVatAmount = 0

           service.displayRateInfo.forEach(rate =>{
            if (rate.purpose == "1")
            addBaseAmount =  rate.amount
            addTaxamount  =  rate.amount / 100 * 7.5 + rate.amount / 100 * 30;
          if (rate.purpose == "7")
          addVatAmount = rate.amount
          
           })
            
           this.additionalSerBaseAmount  += addBaseAmount
           this.additionalSerBaseAmountWithTax += addTaxamount
           this.additionalSerVatAmount += addVatAmount


      })


    }

    let taxesObject = {
      totalTxAmount: baseAmount / 100 * 30 + baseAmount / 100 * 7.5 + vatAmount + feesAmount + this.additionalSerBaseAmount +  this.additionalSerVatAmount,
      baseAmount: baseAmount + this.additionalSerBaseAmount,
      vatAmount: vatAmount,
      feesAmount: feesAmount,
      gdsTax: baseAmount / 100 * 7.5,
      otaTax: baseAmount / 100 * 30
    }
    return taxesObject;
  }

  clearQuantityIfNecessary(id) {
    var Quntity = this.GroundServicesFormGroup.get(`rows.${id}`).value.quantity;
    var Duration = this.GroundServicesFormGroup.get(`rows.${id}`).value.duration;
    if (!this.GroundServicesFormGroup.get(`rows.${id}`).value.checkbox_value) {
      this.GroundServicesFormGroup.get(`rows.${id}`).patchValue({ quantity: "" });
    } else {
      this.GroundServicesFormGroup.get(`rows.${id}`).patchValue({ quantity: Quntity });
      this.GroundServicesFormGroup.get(`rows.${id}`).patchValue({ duration: Duration });
    }
  }

  addToCart(groundService) {
    this.spinner.show();
    this.groundServiceTrackToken = localStorage.getItem('groundServiceTrackToken')
    var requestObj = {
      "context": {
        "cultureCode": this.searchData.context.cultureCode,
        "trackToken": this.groundServiceTrackToken,
        "providerInfo": [
          {
            "provider": groundService.provider
          }
        ]
      },
      "request": {
        "uoCode": groundService.uoCode,
        "nationality": this.searchFilterObj.nationality.countryCode,
        "countryOfResidence": this.searchFilterObj.countryOfResidence.countryCode,
        "vendor": groundService.vendor,
        "provider": groundService.provider,
        "category": {
          "categoryCode": groundService.category.categoryCode,
          "Quantity": parseInt(this.searchFilterObj.adults_count) + parseInt(this.searchFilterObj.child_count),
          "displayRateInfo": groundService.category.displayRateInfo,
          "arrivalDate": groundService.category.arrivalDate
        },
        "additionalServices": groundService.additionalServices,
        "policies": groundService.policies,
        "termsAndConditions": groundService.termsAndConditions,
        "config": groundService.config,
        "images": groundService.images
      }
    }
    this.teejanServices.getGroundServiceAvailability(requestObj).subscribe((groundavabilityResponse) => {
      this.spinner.hide()
      localStorage.setItem("groundAvailabilityToken", groundavabilityResponse.headers.get('tracktoken'))
      localStorage.setItem("groundCart", JSON.stringify(groundavabilityResponse.body));
      swal.fire({
        position: 'top-end',
        icon: 'success',
        width: '22em',
        title: 'Added to the cart',
        showConfirmButton: false,
        timer: 3000
      })
      this.router.navigateByUrl("b2c/bookingsummary")
    })
  }

  searchAgain() {
    this.router.navigateByUrl("b2c/ground");
  }

  backToGroundServicesList() {
    this.bindGroundServiceFilterData();
  }
  bookingSummary() {
    this.router.navigateByUrl("b2c/bookingsummary");
  }


  /* Filter clear method */
  public clearFilter(type): void {
    switch (type) {
      case "name":
        this.groundservice_name_filter = "";
        break;

      case "price":
        this.mainGroundServiceList.sort((a, b) => a.category.displayRateInfo[0].amount - b.category.displayRateInfo[0].amount)
        this.minValue = this.mainGroundServiceList[0].category.displayRateInfo[0].amount;
        this.maxValue = this.mainGroundServiceList[
          this.mainGroundServiceList.length - 1
        ].category.displayRateInfo[0].amount;
        this.options = {
          floor: this.minValue,
          ceil: this.maxValue
        };

        this.groundServiceList = this.mainGroundServiceList
        break;
      default: break;
    }
  }

  /* price slider change event */
  public priceSliderChange(event): void {
    this.priceChangeMinValue = event.value;
    this.priceChangeMaxValue = event.highValue;

    //Price Range Filter
    let temp = [];
    this.mainGroundServiceList.forEach(element => {
      if (
        element.category.displayRateInfo[0].amount >=
        event.value &&
        element.category.displayRateInfo[0].amount <=
        event.highValue
      ) {
        temp.push(element);
      }
    });
    if (temp.length > 0) this.groundServiceList = temp;
  }



}
