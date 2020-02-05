import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { DOCUMENT } from "@angular/platform-browser";
import swal from "sweetalert2";
import {
  NgbModal,
  NgbModalRef,
  ModalDismissReasons,
  NgbModalConfig
} from "@ng-bootstrap/ng-bootstrap";
import { B2bSignInComponent } from "../b2b-sign-in/b2b-sign-in.component";
import { SearchPanelComponent } from "../search-panel/search-panel.component";
import { BroadcastserviceService } from "src/app/services/broadcastservice.service";
import { B2cSignUpComponent } from 'src/app/b2c/b2c-sign-up/b2c-sign-up.component';
@Component({
  selector: "app-booking-summary",
  templateUrl: "./booking-summary.component.html",
  // encapsulation: ViewEncapsulation.None,
  styleUrls: ["./booking-summary.component.scss"]
})
export class BookingSummaryComponent implements OnInit {
  public hotelcart: any = {};
  public searchFilterObj: any = {};
  public searchObj : any
  public guests = 0;
  public roomsBasePrice = 0;
  public roomsFees = 0;
  public roomsVAT = 0;
  public roomsGDS = 0;
  public roomsOTA = 0;
  public hotelTotalPrice = 0;
  public numberOfNights : any


  public transportCart: any = {};
  public transportBasePrice = 0;
  public transportVAT = 0;
  public transportGDS = 0;
  public transportOTA = 0;
  public transportTotalPrice = 0;
  public transportQuantity = 0;

  public groundCart: any = {};
  public groundBasePrice = 0;
  public groundVAT = 0;
  public groundGDS = 0;
  public groundOTA = 0;
  public groundTotalPrice = 0;
  public groundQuantity = 0;

  public  additionalSerBaseAmount = 0
  public  additionalSerGDS= 0
  public  additionalSerOTA= 0
  public  additionalSerVatAmount = 0

  public cartGrandTotal = 0;

  public user : any
  closeResult: string;
  modal: NgbModalRef;
  
  constructor(
    private router: Router,
    @Inject(DOCUMENT) document: any,
    private modalService: NgbModal,
    private broadcastService: BroadcastserviceService
  ) {
    this.broadcastService.customStepper.emit(true);
  }

  ngOnInit() {
    this.broadcastService.stepperValue.emit(3);
    localStorage.setItem("stepperVal", 3 + "");
    this.hotelcart = JSON.parse(localStorage.getItem("hotelcart"));
    this.searchObj = JSON.parse(localStorage.getItem("searchObj"));
    this.user = localStorage.getItem("userData");

    
    const checkInDate = new Date(this.searchObj.request.checkInDate);
      
    const checkOutDate = new Date(this.searchObj.request.checkOutDate);

    const timeDiff = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    this.numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    console.log("numberOfNights" , this.numberOfNights)
 

    this.searchFilterObj = JSON.parse(localStorage.getItem("searchFilterObj"));
    this.guests =
      parseInt(this.searchFilterObj.adults_count) +
      parseInt(this.searchFilterObj.child_count);

    this.transportCart = JSON.parse(localStorage.getItem("transportcart"));
    this.groundCart = JSON.parse(localStorage.getItem("groundCart"));

    if (document.location.href.toString().includes("b2c"))
      localStorage.setItem("modulepath", "b2c");
    else localStorage.setItem("modulepath", "b2b");

    this.hotelCalculations();
    this.transportCalculations();
    this.groundCalculations();
    this.cartGrandTotal =
      this.hotelTotalPrice +
      this.transportTotalPrice +
      this.groundTotalPrice +
      this.guests * 300 




  }

  public hotelCalculations() {


    console.log("numberOfNigts" , this.numberOfNights)
    if (this.hotelcart != null || this.hotelcart != undefined) {
      let roomsDisplayRates = this.hotelcart.roomGroups[0].rooms.map(
        rate => rate.displayRateInfo
      );

      roomsDisplayRates.forEach(roomRate => {
        roomRate.forEach(priceDetails => {
          if (priceDetails.purpose == "1") {

                 
            this.roomsBasePrice += priceDetails.amount * this.numberOfNights;
            
            this.roomsGDS += priceDetails.amount / 100 * 7.5 * this.numberOfNights
            this.roomsOTA += priceDetails.amount / 100 * 30 * this.numberOfNights

              
          }
          if (priceDetails.purpose == "2") {
            this.roomsFees += priceDetails.amount * this.numberOfNights;
          }
          // if (priceDetails.purpose == "20") {
          //   this.roomsGDS += priceDetails.amount;
          // }
          // if (priceDetails.purpose == "30") {
          //   this.roomsOTA += priceDetails.amount;
          // }
          if (priceDetails.purpose == "7") {
            this.roomsVAT += priceDetails.amount * this.numberOfNights;
          }
        });
      });

      this.hotelTotalPrice =
        this.roomsBasePrice +
        this.roomsFees +
        this.roomsVAT +
        this.roomsGDS +
        this.roomsOTA 

        // this.hotelTotalPrice = totlaprice * this.numberOfNights
      console.log("hoteTotalPrice", this.hotelTotalPrice);
    }
  }

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

      this.transportTotalPrice=
        this.transportBasePrice +
        this.transportVAT +
        this.transportGDS +
        this.transportOTA;


     
      console.log("transportTotalPrice", this.transportTotalPrice);
    }
  }

  public groundCalculations() {
    if (this.groundCart != null || this.groundCart != undefined) {
      this.groundQuantity = 1;
      if(this.groundCart.category.displayRateInfo !=undefined)
      { this.groundCart.displayRateInfo.forEach(rate => {

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
        
      if(this.groundCart.additionalServices != undefined){

        this.groundCart.additionalServices.forEach(service =>{
          var baseAmount = 0
          var vatAmount = 0
          var GDS = 0
          var OTA = 0 
          service.displayRateInfo.forEach(rate =>{
           if (rate.purpose == "1")
           baseAmount = rate.amount
           GDS = rate.amount / 100 * 7.5 
           OTA = rate.amount / 100 * 30 

         if (rate.purpose == "7")
         vatAmount = rate.amount 
          })
          this.additionalSerGDS += GDS   
          this.additionalSerOTA +=  OTA
          this.additionalSerVatAmount +=  vatAmount
          this.additionalSerBaseAmount +=  baseAmount
          console.log("additionalSerBaseAmount" , this.additionalSerBaseAmount)
          console.log("additionalSerVatAmount" , this.additionalSerVatAmount)
          console.log("additionalSerGDSloop" , this.additionalSerGDS)
          console.log("additionalSerOTA" , this.additionalSerOTA)
          console.log("additionalSerVatAmount" , this.additionalSerVatAmount)
     })
      }

      console.log("groundCart" , JSON.stringify(this.groundCart))
          //  console.log("additionalSerBaseAmount " , this.additionalSerBaseAmount )
          //  console.log("additionalSerGDS " , this.additionalSerGDS )
          //  console.log("additionalSerOTA " , this.additionalSerOTA )
          //  console.log("additionalSerVatAmount " , this.additionalSerVatAmount )


          this.groundBasePrice += this.additionalSerBaseAmount
          this.groundGDS += this.additionalSerGDS
          this.groundOTA += this.additionalSerOTA
          this.groundVAT += this.additionalSerVatAmount
          // console.log("this.groundBasePrice " , this.groundBasePrice )
          // console.log("this.groundGDS " , this.groundGDS )
          // console.log("this.groundOTA " , this.groundOTA )
          // console.log("this.groundVAT " , this.groundVAT )


      this.groundTotalPrice  =
        this.groundBasePrice + this.groundVAT + this.groundGDS + this.groundOTA ;
      
      }

     
     
    }
  }

  checkout() {

    this.broadcastService.customStepper.emit(false)

     localStorage.setItem("checkout" , "true")

    swal
    .fire({
      text: "Please to continue",
      showCancelButton: true,
      confirmButtonColor: "#bb9356",
      cancelButtonColor: "#bb9356",
      confirmButtonText: "Login", 
      cancelButtonText : "Register"
      
    })
    .then(result => {

      if (result.value == true) {
        // this.router.navigateByUrl("b2c/login");
        // this.modalService.open(B2bSignInComponent);
      
        this.modal = this.modalService.open(B2bSignInComponent);
        console.log(" this.modal" ,  this.modal.result)
        // modal.componentInstance.title = "Dialog";
        // modal.componentInstance.body = "Your message";
        this.modal.result.then(
          result => {

            this.closeResult = `Closed with: ${result}`;
            

          },
          reason => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
      }else{
        
        this.modal = this.modalService.open(B2cSignUpComponent);
        console.log(" this.modal" ,  this.modal.result)
        // modal.componentInstance.title = "Dialog";
        // modal.componentInstance.body = "Your message";
        this.modal.result.then( result => {

            this.closeResult = `Closed with: ${result}`;
            console.log("modelResult" , this.closeResult)

          },
          reason => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
      }
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
