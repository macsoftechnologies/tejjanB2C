import { Component, OnInit } from '@angular/core';
import { AlrajhiumrahService } from 'src/app/services/alrajhiumrah.service';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { sha256, sha224 } from 'js-sha256';
@Component({
  selector: 'app-my-booking',
  templateUrl: './my-booking.component.html',
  styleUrls: ['./my-booking.component.scss']
})
export class MyBookingComponent implements OnInit {

 public searchObj : any

  public hotelBookingResponse: any;
  public hotelAmount = 0
  public hotel :  any
  public numberOfNights : any
  public adults = 0
  public childrens  = 0
  public guests = 0
  public transportBookingResponse : any
  public transportAmount = 0
  public transport : any
  public tansportTaxAmount = 0
  public tansportTotalAmount = 0


  public groundBookingResponse : any
  public groundAmount = 0
  public ground : any

  public hotelProvider :  any;
  public transportProvider :  any;
  public groundProvider :  any;

  mutamersArray = [];

 public evisaMutmerDetails = []
  requestId: any;
  constructor(private tejaanServices: AlrajhiumrahService , private spinner : NgxSpinnerService , private router : Router) {
    // console.log("booking reservation response ", JSON.parse(localStorage.getItem("hotelBookingResponse")));
    this.hotelBookingResponse = JSON.parse(localStorage.getItem("hotelBookingResponse"));
    this.hotelAmount = JSON.parse(localStorage.getItem("hotelAmount"))
    this.transportBookingResponse = JSON.parse(localStorage.getItem("transportBookingResponse"));
    this.transportAmount = JSON.parse(localStorage.getItem("transportAmount"))
    this.groundBookingResponse = JSON.parse(localStorage.getItem("groundBookingResponse"));
    this.groundAmount = JSON.parse(localStorage.getItem("groundAmount"))
    this.evisaMutmerDetails = JSON.parse(localStorage.getItem("evisaMutmerDetails"))
    this.hotelProvider = localStorage.getItem("hotelProvider")     
    this.transportProvider = localStorage.getItem("transportProvider")     
    this.groundProvider = localStorage.getItem("groundProvider")     
    this.searchObj = JSON.parse(localStorage.getItem("searchObj"))

     console.log("groundProvider" , this.groundBookingResponse);
     console.log("transportProvider" , this.transportBookingResponse);
     console.log("hotelProvider" , this.hotelBookingResponse);

    this.viewHotelReservation();
    this.viewTransportReservation();
    this.viewGroundReservations();
  }

  ngOnInit() {
  }

  // ***************  hotel Invoice  ***************

  hotelInvoice() {
    swal.fire({
      title: 'Custom animation with Animate.css',
      showClass: {
        popup: 'animated fadeInDown faster'
      },
      hideClass: {
        popup: 'animated fadeOutUp faster'
      }
    })
  }
  /* method to call view hotel reservation api */
  public viewHotelReservation(): void {



    if(this.hotelBookingResponse != null){
  
      // this.spinner.show();  
    
    let formData = {
      "context": {
        "cultureCode": "en-US",
        "providerInfo": [{
          "provider": this.hotelProvider
        }]
      },
      "request": this.hotelBookingResponse.bookingReferenceNo
    }
    this.tejaanServices.getHotelViewReservation(formData).subscribe(viewHotelReservationResp => {
     
        this.spinner.hide();
           
        if(viewHotelReservationResp.body.bookingStatus == "Confirmed"){

          this.hotel  = viewHotelReservationResp.body
        
           
          const checkInDate = new Date(this.hotel.hotelDetails.checkInDate);
          const checkOutDate = new Date(this.hotel.hotelDetails.checkOutDate);
      
          const timeDiff = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
          this.numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
       
       
            this.hotel.hotelDetails.roomGroups[0].rooms.forEach(room =>{

                   room.paxInfo.forEach(pax =>{
                     
                    if(pax.type == "ADT"){
                        this.adults += pax.quantity
                    }else if(pax.type == "CHD"){
                        this.childrens +=  1
                    } 

                   })

            })
            
            this.guests = this.adults + this.childrens;
            localStorage.setItem("hotelReservationTrackToken", viewHotelReservationResp.headers.get('tracktoken'));

        }
         
    }, (err) => {

    })

  }
  }

  public viewTransportReservation(): void{
    if(this.groundBookingResponse != undefined){
    if(this.transportBookingResponse.bookingReferenceNo != null || this.transportBookingResponse.bookingReferenceNo != undefined){

    let formData = {
      "context": {
        "cultureCode": "en-US",
        "providerInfo": [{
          "provider": this.transportProvider
        }]
      },
      "request": this.transportBookingResponse.bookingReferenceNo
    }

    this.tejaanServices.getTransPortViewReservation(formData).subscribe(viewTransortReservationResp => {


        // if(viewTransortReservationResp.bookingReferenceNo != undefined){

      this.transport = viewTransortReservationResp.body

      console.log("transportView" , this.transport)
        //  if(this.transport.vehicleTypes != undefined) { 
        //  this.transport.vehicleTypes.foreach(vehicle =>{

        //          vehicle.categories[0].displayRateInfo.foreach(rate =>{
                          
        //             if(rate.purpose == "1"){
        //                   const GDSTAX =  (rate.amount / 100) * 7.5
        //                   const OTATAX =  (rate.amount / 100) * 30
        //                  this.tansportTaxAmount += GDSTAX + OTATAX
        //             }
                    
        //             if(rate.purpose == "10"){
        //                this.tansportTotalAmount += rate.amount + this.tansportTaxAmount
        //             }
        //          })
        //  })
        // }


      // }
    })

  }
}
  }  
   
  public viewGroundReservations(): void{
  if(this.groundBookingResponse != undefined){
   if(this.groundBookingResponse.bookingReferenceNo != null || this.groundBookingResponse.bookingReferenceNo != undefined){

 

  let formData = {
    "context": {
      "cultureCode": "en-US",
      "providerInfo": [{
        "provider": this.groundProvider 
      }]
    },
    "request": this.groundBookingResponse.bookingReferenceNo
  }

  this.tejaanServices.getGroundServiceViewReservation(formData).subscribe(viewGroundReservationResp => {
        
        //  if(viewGroundReservationResp.body.bookingReferenceNo != undefined){
     this.ground = viewGroundReservationResp.body
           
        //  }

       
  })

   }
  }
 }
 

  public cancelHotelReservation(): void{
       
    // const swalWithBootstrapButtons = swal.mixin({
    //   customClass: {
    //     confirmButton: 'btn btn-success',
    //     cancelButton: 'btn btn-danger'
    //   },
    //   buttonsStyling: false
    // })

    swal.fire({
      title: '',
      icon: 'question',
      html: 'Are u sure want to cancel booking....?',
        
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Yes',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      cancelButtonText: 'No',
      cancelButtonAriaLabel: 'Thumbs down'
    }).then((result) => {
      if (result.value) {

        this.spinner.show()
        let trackToken = localStorage.getItem("hotelReservationTrackToken");

        let Obj = {
          "context": {
            "cultureCode": "en-US",
            "trackToken": trackToken,
            "providerInfo": [{
              "provider": "HUDXConnect"
            }]
          },
          "request": this.hotelBookingResponse.bookingReferenceNo
        }
      // console.log("Obj" , Obj);
        this.tejaanServices.getCancelHotelReservation(Obj).subscribe((cancelHotelReservation) => {
          this.spinner.hide();
          console.log("cancelHotelReservation" , cancelHotelReservation)
          if (cancelHotelReservation.body.bookingStatus == "Cancelled") {

            this.router.navigateByUrl('b2b/bookingcancel');
          } else {
            swal.fire(
              'Your Hotel Booking cancellation Failuer',
            )
          }
        })
      }
    })
  }

  evisaDetails() {

    //********** if(this.hotelBookingResponse.bookingReferenceNo != undefined && this.transportBookingResponse.bookingReferenceNo != undefined && this.groundBookingResponse.bookingReferenceNo != undefined)
    // this.hotel.roomGroups[0].rooms[0].travellerDetails.forEach(travellerDet => {
    //   let mutamersArrayObj = {
    //     "DateOfBirth": travellerDet.details.birthDate,
    //     "PassportNo": "k1860845", //travellerDet.details.passportNo
    //     "NationalityId": "20", // travellerDet.details.nationalityCode
    //     "Gender": travellerDet.details.gender
    //   }
    //   this.mutamersArray.push(mutamersArrayObj);
    // })
    // let evisaObj = {
    //   "GroupId": "637014587514758273",
    //   "BrnId": {
    //       "Hotels": [
    //         this.hotelBookingResponse.bookingReferenceNo,
    //       ],
    //       "Transpotations": [
    //         this.transportBookingResponse.bookingReferenceNo,
    //       ],
    //       "GroundServices": [
    //         this.groundBookingResponse.bookingReferenceNo,
    //       ]
    //   },
    //   "Email": this.hotel.roomGroups[0].rooms[0].travellerDetails[0].details.contactInformation.email,
    //   "MobileNo": this.hotel.roomGroups[0].rooms[0].travellerDetails[0].details.contactInformation.phoneNumber,
    //   "ArrivalAirportCode": "",
    //   "ArrivalFlightNumber": "",
    //   "ArrivalDate": "",
    //   "ArrivalTime": "",
    //   "DepartureAirportCode": "",
    //   "DepartureFlightNumber": "",
    //   "DepartureDate": "",
    //   "DepartureTime": "",
    //   "Mutamers": this.mutamersArray
    // }
     
    var randomNumber = Math.floor(Math.random() * 20000000 + 1);

    let evisaObj = {
      "GroupId": randomNumber,
      "BrnId": {
          "Hotels": [
            this.hotelBookingResponse.bookingReferenceNo
          ],
          "Transpotations": [
            this.transportBookingResponse.bookingReferenceNo
          ],
          "GroundServices": [
            this.groundBookingResponse.bookingReferenceNo
          ]
      },
      "Email": "sanjeev@gmail.com",
      "MobileNo": "9705385368",
      "ArrivalAirportCode": "",
      "ArrivalFlightNumber": "",
      "ArrivalDate": this.searchObj.request.checkInDate,
      "ArrivalTime": "23:59:00",
      "DepartureAirportCode": "",
      "DepartureFlightNumber": "",
      "DepartureDate": this.searchObj.request.checkOutDate,
      "DepartureTime": "14:45:00",
      "Mutamers":  this.evisaMutmerDetails
  }

  console.log("evisaObj" , evisaObj);
  
    this.tejaanServices.getEvisaDetails(evisaObj).subscribe((evisaDetailsResponse) => {
      console.log(evisaDetailsResponse);
      localStorage.setItem("evisaResponse",JSON.stringify(evisaDetailsResponse));
      this.requestId = evisaDetailsResponse.MutamersGroupResponse.MutamerStatus.RequestId;
      let sha256Str=this.evisaMutmerDetails[0].PassportNo+
      this.evisaMutmerDetails[0].PassportNo+
      this.requestId+"en";
      
      if(this.requestId != null){
       let evisaLinkObj = {
          "NationalityId": "91",
          "PassportNo": this.evisaMutmerDetails[0].PassportNo,
          "RequestId": this.requestId,
          "Lang": "en",
          "Token":sha256(sha256Str)
       }
        this.tejaanServices.getEvisaLink(evisaLinkObj).subscribe((evisaLinkResponse) => {
          // console.log("hiiiiiiiiiii")
           console.log(evisaLinkResponse);

           window.open(evisaLinkResponse.evisaLink)
        });
      }
    });
  
  }


  cancelordermsg(){
    
  }

}