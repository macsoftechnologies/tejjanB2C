import { Component, OnInit } from "@angular/core";

import { AlrajhiumrahService } from "../../services/alrajhiumrah.service";

@Component({
  selector: "app-b2c-sign-up",
  templateUrl: "./b2c-sign-up.component.html",
  styleUrls: ["./b2c-sign-up.component.scss"]
})
export class B2cSignUpComponent implements OnInit {
  countries: any;

  constructor(private tejaanServices: AlrajhiumrahService) {}

  ngOnInit() {
    this.getCountries();
  }

  //  ****** Get countries List *****

  public getCountries(): void {
    this.tejaanServices.getCountyList().subscribe(data => {
      this.countries = data;
      // console.log("countries List", JSON.stringify(this.countries));
    });
  }

  resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
}
