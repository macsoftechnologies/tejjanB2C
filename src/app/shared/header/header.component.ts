import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { BroadcastserviceService } from 'src/app/services/broadcastservice.service';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  user: any;
  showHideLogin: boolean = true;
  constructor(private router: Router, private broadcastservice: BroadcastserviceService) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('userData'));
    if (this.user == null && this.user == undefined) {
      this.showHideLogin = true;
    }
    else {
      this.showHideLogin = false;
    }
    this.broadcastservice.showHideLogin.subscribe((data) => {
      if (data == true) {
        this.showHideLogin = false;
      }
      else {
        this.showHideLogin = true;
      }
    })
  }

  ngAfrterViewInit() {
    this.broadcastservice.showHideLogin.subscribe((data: any) => {
    });
  }

  logout() {
    this.broadcastservice.showHideLogin.emit(false);
    this.router.navigateByUrl('b2c/signin');
    localStorage.removeItem('userData');
  }

  bookigSummary() {
    let hotelCart = localStorage.getItem("hotelcart");
    if (hotelCart != null || hotelCart != undefined) {
      this.router.navigateByUrl('b2c/bookingsummary')
    }
  }

  sucess() {
    this.router.navigateByUrl('b2c/payment/success')
  }
  failure() {
    this.router.navigateByUrl('b2c/payment/failure')
  }

}
