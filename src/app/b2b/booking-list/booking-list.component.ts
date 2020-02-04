import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  bookingListForm: FormGroup;
  bookingListFormValidationFlag: boolean;
  public bookingStatus = [ "Confirmed" , "Not-Confirmed" , "Cancelled" ];
  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit() {
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
      let bookingListObj = {
        checkIn: this.bookingListForm.value.checkIn,
        checkOut: this.bookingListForm.value.checkOut,
        bookingStartDate: this.bookingListForm.value.bookingStartDate,
        bookingEndDate: this.bookingListForm.value.bookingEndDate,
        bookingStatus: this.bookingListForm.value.bookingStatus
      }
      console.log("bookingListObj" , bookingListObj);
    }
    else {
      console.log("else case---");
    }
  }
}
