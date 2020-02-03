import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.scss']
})
export class BookingListComponent implements OnInit {
  bookingListForm: FormGroup;

  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.loadBookingListForm();
  }

  public loadBookingListForm(): void {
    this.bookingListForm = this.formBuilder.group({
      checkIn: ["", Validators.required],
      checkOut: ["", Validators.required]
    });
  }

  public searchBookingList(): void {
    let bookingListObj = {
      checkIn: this.bookingListForm.value.checkIn,
      checkOut: this.bookingListForm.value.checkOut,
    }

    console.log("bookingListObj" , bookingListObj);
  }
}
