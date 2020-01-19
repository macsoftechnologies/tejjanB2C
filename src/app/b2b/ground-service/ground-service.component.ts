import { Component, OnInit } from "@angular/core";
import { AlrajhiumrahService } from 'src/app/services/alrajhiumrah.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';
import { Options, LabelType } from "ng5-slider";

@Component({
  selector: "app-ground-service",
  templateUrl: "./ground-service.component.html",
  styleUrls: ["./ground-service.component.scss"]
})
export class GroundServiceComponent implements OnInit {
  public searchData: any = {};
  public countriesList: any[] = [];
  // public groundResultsNotFound: boolean;
  public isFirstTimeLoad: boolean = true;
  public groundServiceList = [];
  public groundViewDetails : any;
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


  public taxAmount = 0
  public feeAmount = 0

  /*Ground Currencies*/

  public groundCurrencies = ["SAR", "INR"];
  /*Ground Currencies*/

  /* Price Range */
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

  constructor(private router: Router, private teejanServices: AlrajhiumrahService, private spinner: NgxSpinnerService,
    private fb: FormBuilder, ) { }

  ngOnInit() {
    this.getGroundServicesLookup();

    this.searchData = JSON.parse(localStorage.getItem("searchObj"));
    this.searchFilterObj = JSON.parse(localStorage.getItem("searchFilterObj"));
    this.loadGroundSericeFilterForm();
    this.country();
  }


  public getGroundServicesLookup(): void {
    this.teejanServices.getGroundServiceLookup().subscribe((groundServiceResponse) => {
      // console.log("groundServiceResponse" , groundServiceResponse)
      this.categories = JSON.parse(groundServiceResponse.categories).categories; 
      this.companies = JSON.parse(groundServiceResponse.uocompanies).uocompanies;
      console.log(" this.companies" ,  this.companies)
      this.additionalServices = JSON.parse(groundServiceResponse.additionalservices).additionalServices;
      // console.log(" this.additionalServices" ,  this.additionalServices)

      this.patchValues();

    }, (err) => {

    })
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
      countryOfResidence:[null , Validators.required],
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
    })
    console.log(JSON.stringify(this.GroundServicesFormGroup.value));
    this.onGroundServicesSearch();
  }

  /* call ground service search api */
  public onGroundServicesSearch(): void {
    // filter selected GroundServices from all GroundServices
    var groundServices = this.GroundServicesFormGroup.value.rows.filter((response) => {
      return response.quantity != ""
    });

    // remove checkbox_value  and name
    let groundServices1 = groundServices.map(function (item) {
      delete item.checkbox_value;
      delete item.name
      return item;
    });

    let formData = {
      "context": {
        "cultureCode": this.searchData.context.cultureCode,
      },
      "request": {
        "nationality":  this.searchFilterObj.nationality.countryCode,
        "countryOfResidence":this.searchFilterObj.countryOfResidence.countryCode ,
        "arrivalDate": this.searchData.request.checkInDate,
        "quantity": this.GroundServicesFormGroup.value.noOfPax,
        "additionalServices": groundServices1
      }
    }



    if (formData.request.additionalServices.length <= 0) {
      delete formData.request.additionalServices
    }


    this.teejanServices.getGroundServiceSearch(formData).subscribe((resp) => {
      this.isFirstTimeLoad = false;

     
      localStorage.setItem("groundServiceTrackToken", resp.headers.get('tracktoken'))


           this.companies.forEach(comapny =>{
            resp.body.groundServices.forEach(groundCompany =>{
                if(comapny.code === groundCompany.uoCode){
                  groundCompany.companyName = comapny.name
                  groundCompany.comapnyDescription = comapny.description
                  groundCompany.address = comapny.address

                }
            })
           })



      this.groundServiceList = resp.body.groundServices

      
    }, (err) => {

    })
  }

  onGroundServices(){
    console.log("onGroundServices")
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


         this.categories.forEach( category =>{

            if(category.code === groundService.category.categoryCode){
              groundService.category.categoryName = category.name

            }

         })


         groundService.category.displayRateInfo.forEach(rate => {

                if (rate.purpose == "1") {
                  let GDSobject = {
                    amount: (rate.amount / 100) * 7.5,
                    purpose: "20",
                    description: "GDSTAX",
                    currencyCode: "SAR"
                  };
                  groundService.category.displayRateInfo.push(GDSobject);
                  let OTAobject = {
                    amount: (rate.amount / 100) * 30,
                    purpose: "30",
                    description: "OTATAX",
                    currencyCode: "SAR"
                  };
                  groundService.category.displayRateInfo.push(OTAobject);
      
                  // calculating all taxes (OTA + GDS + VAT(TAX) + FEES)
                  if (rate.purpose == "7") {
                    this.taxAmount = 0;
                    this.taxAmount = rate.amount;
                  }
                  if (rate.purpose == "2") {
                    this.feeAmount = 0;
                    this.feeAmount = rate.amount;
                  }
      
                  let taxesObject = {
                    amount:
                      (rate.amount / 100) * 30 +
                      (rate.amount / 100) * 7.5 +
                      this.taxAmount +
                      this.feeAmount,
                    purpose: "40",
                    description: "TAXES",
                    currencyCode: "SAR"
                  };
                  groundService.category.displayRateInfo.push(taxesObject);
                }
      
      
              })


      this.groundViewDetails = groundService

console.log("this.groundViewDetails" , this.groundViewDetails)
    // this.groundServiceTrackToken = localStorage.getItem('groundServiceTrackToken')
    // var requestObj = {
    //   "context": {
    //     "cultureCode": this.searchData.context.cultureCode,
    //     "trackToken": this.groundServiceTrackToken,
    //     "providerInfo": [
    //       {
    //         "provider": groundService.provider
    //       }
    //     ]
    //   },
    //   "request": {
    //     "uoCode": groundService.uoCode,
    //     "nationality": this.searchFilterObj.nationality.countryCode,
    //     "countryOfResidence": this.searchFilterObj.countryOfResidence.countryCode,
    //     "vendor": groundService.vendor,
    //     "provider": groundService.provider,
    //     "category": {
    //       "categoryCode": groundService.category.categoryCode,
    //       "quantity":  parseInt(this.searchFilterObj.adults_count) + parseInt(this.searchFilterObj.child_count),
    //       "displayRateInfo": groundService.category.displayRateInfo,
    //       "arrivalDate": groundService.category.arrivalDate
    //     },
    //     "additionalServices": [],
    //     "policies": groundService.policies,
    //     "termsAndConditions": groundService.termsAndConditions,
    //     "config": groundService.config,
    //     "images" : groundService.images
    //   }



    // }

    // this.teejanServices.getGroundServiceAvailability(requestObj).subscribe((groundavabilityResponse) => {

    //   this.spinner.hide();

    //   if (groundavabilityResponse.body.displayRateInfo != undefined) {

    //     this.isGroundAvailabilty = true

    //     localStorage.setItem("groundAvailabilityToken", groundavabilityResponse.headers.get('tracktoken'))

    //     localStorage.setItem("groundAvailability", JSON.stringify(groundavabilityResponse.body))

      

    //     groundavabilityResponse.body.displayRateInfo.forEach(rate => {

    //       if (rate.purpose == "1") {
    //         let GDSobject = {
    //           amount: (rate.amount / 100) * 7.5,
    //           purpose: "20",
    //           description: "GDSTAX",
    //           currencyCode: "SAR"
    //         };
    //         groundavabilityResponse.body.displayRateInfo.push(GDSobject);
    //         let OTAobject = {
    //           amount: (rate.amount / 100) * 30,
    //           purpose: "30",
    //           description: "OTATAX",
    //           currencyCode: "SAR"
    //         };
    //         groundavabilityResponse.body.displayRateInfo.push(OTAobject);

    //         // calculating all taxes (OTA + GDS + VAT(TAX) + FEES)
    //         if (rate.purpose == "7") {
    //           this.taxAmount = 0;
    //           this.taxAmount = rate.amount;
    //         }
    //         if (rate.purpose == "2") {
    //           this.feeAmount = 0;
    //           this.feeAmount = rate.amount;
    //         }

    //         let taxesObject = {
    //           amount:
    //             (rate.amount / 100) * 30 +
    //             (rate.amount / 100) * 7.5 +
    //             this.taxAmount +
    //             this.feeAmount,
    //           purpose: "40",
    //           description: "TAXES",
    //           currencyCode: "SAR"
    //         };
    //         groundavabilityResponse.body.displayRateInfo.push(taxesObject);
    //       }





    //     })

    //     this.groundServiceAvailability = groundavabilityResponse.body
    //     console.log("groundServiceAvailabilityCheck", groundavabilityResponse.body)


    //   } else {

    //      this.isGroundAvailabilty = false
    //     setTimeout(() => {
           
    //       this.bindGroundServiceFilterData()


    //     }, 5000)

    //   }
    // })




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
    for (let n = 0; n < groundService.category.displayRateInfo.length; n++) {

      if (groundService.category.displayRateInfo[n].purpose === "20") {
        groundService.category.displayRateInfo.splice(n, 1)
        n--
      } else if (groundService.category.displayRateInfo[n].purpose === "30") {
        groundService.category.displayRateInfo.splice(n, 1)
        n--
      } else if (groundService.category.displayRateInfo[n].purpose === "40") {
        groundService.category.displayRateInfo.splice(n, 1)
        n--
      }

    }


      console.log("groundService" , groundService)

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
          "Quantity":  parseInt(this.searchFilterObj.adults_count) + parseInt(this.searchFilterObj.child_count),
          "displayRateInfo": groundService.category.displayRateInfo,
          "arrivalDate": groundService.category.arrivalDate
        },
        "additionalServices": [],
        "policies": groundService.policies,
        "termsAndConditions": groundService.termsAndConditions,
        "config": groundService.config,
        "images" : groundService.images
      }


    }


    this.teejanServices.getGroundServiceAvailability(requestObj).subscribe((groundavabilityResponse) => {

       this.spinner.hide()

      console.log("groundavabilityResponse" , groundavabilityResponse)
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
      console.log("groundService", groundService)
  
  
      this.router.navigateByUrl("b2c/bookingsummary")
  


    })










    
  }

  searchAgain() {
    // this.groundResultsNotFound  = false
    this.router.navigateByUrl("b2b/ground");
    // this.isGroundServicesAvailableFlag = false;

  }


  backToGroundServicesList(){
    this.bindGroundServiceFilterData();
   
  }
  bookingSummary() {
    this.router.navigateByUrl("b2c/bookingsummary");

    // if ((document.location.href).toString().includes("b2b")) {
    //   this.router.navigateByUrl("b2b/bookingsummary");
    // } else {
    // }
    // this.router.navigateByUrl("b2b/bookingsummary")
  }

}
