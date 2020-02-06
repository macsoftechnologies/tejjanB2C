import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlrajhiumrahService } from 'src/app/services/alrajhiumrah.service';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  bookingListForm: FormGroup;
  bookingListFormValidationFlag: boolean;
  user : any
  transportBookingList = []
  hotelBookingList = []

  hotelFlag : boolean 
  transportFlag : boolean 

  public bookingStatus = [ "Confirmed" , "Not-Confirmed" , "Cancelled" ];
  constructor(private formBuilder: FormBuilder,  private teejanServices: AlrajhiumrahService) { }

  ngOnInit() {
    this.user =JSON.parse(localStorage.getItem('userData'))
    this.loadBookingListForm();
  }

  public loadBookingListForm(): void {
    this.bookingListForm = this.formBuilder.group({
      checkIn: ["", Validators.required],
      checkOut: ["", Validators.required],
      bookingStartDate: ["", Validators.required],
      bookingEndDate: ["", Validators.required],
      bookingStatus: ["", Validators.required]
    });
  }

  public searchBookingList(): void {
    this.bookingListFormValidationFlag = this.bookingListForm.valid ? false : true ;

    if( !this.bookingListFormValidationFlag ) {


    // checkInDay
    // console.log("this.bookingListForm.value.checkIn.day" , this.bookingListForm.value.checkIn.day.toString().length())
      if (this.bookingListForm.value.checkIn.day.toString().length < 2 )
      this.bookingListForm.value.checkIn.day = `0${this.bookingListForm.value.checkIn.day}`;
    else
      this.bookingListForm.value.checkIn.day = `${this.bookingListForm.value.checkIn.day}`;
      // bookingStartDay
      if (this.bookingListForm.value.bookingStartDate.day.toString().length < 2)
      this.bookingListForm.value.bookingStartDate.day = `0${this.bookingListForm.value.bookingStartDate.day}`;
    else
      this.bookingListForm.value.bookingStartDate.day = `${this.bookingListForm.value.bookingStartDate.day}`;


    // checkOutDay
    if (this.bookingListForm.value.checkOut.day.toString().length < 2)
      this.bookingListForm.value.checkOut.day = `0${this.bookingListForm.value.checkOut.day}`;
    else
      this.bookingListForm.value.checkOut.day = `${this.bookingListForm.value.checkOut.day}`;

       // bookingEndDay
      if (this.bookingListForm.value.bookingEndDate.day.toString().length < 2)
      this.bookingListForm.value.bookingEndDate.day = `0${this.bookingListForm.value.bookingEndDate.day}`;
    else
      this.bookingListForm.value.bookingEndDate.day = `${this.bookingListForm.value.bookingEndDate.day}`;


    // checkInMonth
    if (this.bookingListForm.value.checkIn.month.toString().length < 2)
      this.bookingListForm.value.checkIn.month = `0${this.bookingListForm.value.checkIn.month}`;
    else
      this.bookingListForm.value.checkIn.month = `${this.bookingListForm.value.checkIn.month}`;
      

    // checkOutMonth
    if (this.bookingListForm.value.checkOut.month.toString().length < 2)
      this.bookingListForm.value.checkOut.month = `0${this.bookingListForm.value.checkOut.month}`;
    else
      this.bookingListForm.value.checkOut.month = `${this.bookingListForm.value.checkOut.month}`;

       // bookingStartMonth
    if (this.bookingListForm.value.bookingStartDate.month.toString().length < 2)
    this.bookingListForm.value.bookingStartDate.month = `0${this.bookingListForm.value.bookingStartDate.month}`;
  else
    this.bookingListForm.value.bookingStartDate.month = `${this.bookingListForm.value.bookingStartDate.month}`;

     // bookingEndMonth
     if (this.bookingListForm.value.bookingEndDate.month.toString().length < 2)
     this.bookingListForm.value.bookingEndDate.month = `0${this.bookingListForm.value.bookingEndDate.month}`;
   else
     this.bookingListForm.value.bookingEndDate.month = `${this.bookingListForm.value.bookingEndDate.month}`;
 


      
    let checkInDate =
      this.bookingListForm.value.checkIn.year +
      "-" +
      this.bookingListForm.value.checkIn.month +
      "-" +
      this.bookingListForm.value.checkIn.day;
    let checkOutDate =
      this.bookingListForm.value.checkOut.year +
      "-" +
      this.bookingListForm.value.checkOut.month +
      "-" +
      this.bookingListForm.value.checkOut.day;
      let bookingStartDate =
      this.bookingListForm.value.bookingStartDate.year +
      "-" +
      this.bookingListForm.value.bookingStartDate.month +
      "-" +
      this.bookingListForm.value.bookingStartDate.day;
      let bookingEndDate =
      this.bookingListForm.value.bookingEndDate.year +
      "-" +
      this.bookingListForm.value.bookingEndDate.month +
      "-" +
      this.bookingListForm.value.bookingEndDate.day;

         var bookingStatus

          if(this.bookingListForm.value.bookingStatus == "Confirmed"){
             bookingStatus = "2"
          }
          
          if(this.bookingListForm.value.bookingStatus == "Not-Confirmed"){
             bookingStatus = "1"
          }
          
          if(this.bookingListForm.value.bookingStatus == "Cancelled"){
             bookingStatus = "3"
          }

      let bookingListObj = {
        user_name : this.user.userName,
        chStartDate: checkInDate,
        chEndDate: checkOutDate,
        bkStartDate: bookingStartDate,
        bkEndDate: bookingEndDate,
        bookingStatus: bookingStatus
      }
      // let bookingListObj1 = {
      //   user_name : this.user.userName,
      //   chStartDate: "2020-02-05",
      //   chEndDate: "2020-06-06",
      //   bkStartDate: "2020-02-05",
      //   bkEndDate: "2020-06-06",
      //   bookingStatus: "1"
      // }

    this.teejanServices.getBookingList(bookingListObj).subscribe(response =>{
      this.hotelBookingList = []
      this.transportBookingList = []
      this.hotelFlag = true

      console.log("bookingListResponse" , response);

      if(response.length != undefined && response.length > 0){

       
        this.hotelBookingList = response.filter(item =>{return item.bookingType == 1})


         
        this.transportBookingList = response.filter(item => {return item.bookingType == 2})

        this.hotelFlag = true

        this.transportFlag = false

      }

    })
      console.log("bookingListObj" , bookingListObj);
    }
    else {
      console.log("else case---");
    }
  }


  reset(){
    this.bookingListForm = this.formBuilder.group({
      checkIn: ["", Validators.required],
      checkOut: ["", Validators.required],
      bookingStartDate: ["", Validators.required],
      bookingEndDate: ["", Validators.required],
      bookingStatus: ["", Validators.required]
    });
     
  }


  hotelPaxInfo(paxDetails){

   let  adults = 0

   let childrens = 0

   if(paxDetails != undefined && paxDetails.length >0 ){

    paxDetails.forEach(pax =>{

         if(pax.type == "ADT"){
          adults += pax.quantity
         }else{
          childrens += pax.quantity
         }   
            

    })

   }

   let people = {
    adults : adults,
    childrens : childrens
   }

   return people

  }

  hotelCalculations(roomInfo){

     
      var hotelBaseAmount = 0
      var GDS = 0
      var OTA = 0
      var VAT = 0

        
    if(roomInfo != undefined && roomInfo.length > 0){

      roomInfo.forEach(group =>{


       if(group.rooms != undefined && group.rooms.length > 0){

          
        group.rooms.forEach(room =>{

           room.displayRateInfo.forEach(rate =>{
  
                if(rate.purpose == 1)
                  hotelBaseAmount += rate.amount
                  GDS += rate.amount / 100 * 7.5
                  VAT += rate.amount / 100 * 30
                  if(rate.purpose == 7)
                  VAT += rate.amount
              
           })
       

        }) 


       }



      })



    } 

  let hotelRateObj = {
  
    hotelBaseAmount : hotelBaseAmount,
    GDS: GDS,
    OTA: OTA,
    VAT : VAT,
    totalAmount :  hotelBaseAmount + GDS + OTA + VAT

  }
     
  return hotelRateObj

  }

  transportion(vehicleTypes){

    var paxDetails = 0
    var transportBaseAmount = 0 
    var GDS = 0 
    var OTA = 0
    var VAT  = 0 


     if(vehicleTypes != undefined && vehicleTypes.length > 0){

            
      vehicleTypes.forEach(vehicle =>{

             vehicle.categories.forEach(cate =>{
               
              paxDetails += cate.noOfPax 

              cate.displayRateInfo.forEach(rate =>{
               
                if(rate.purpose == 1)
                transportBaseAmount += rate.amount,
                GDS += rate.amount / 100 * 7.5,
                OTA += rate.amount / 100 * 30

                if(rate.purpose == 7)

                 VAT += rate.amount 


              })
           

             })

      })
         
      
      let vehicleObj = {

        paxDetails : paxDetails,
        transportBaseAmount : transportBaseAmount,
        GDS :  GDS,
        OTA : OTA,
        VAT : VAT,
        transportTotalAmount : transportBaseAmount + GDS + OTA + VAT

      }

      return  vehicleObj

     }  

          
  }

  hotel(){
    this.hotelFlag = true
    this.transportFlag = false


  }
  transport(){
  this.hotelFlag = false

  this.transportFlag = true

  }
}
