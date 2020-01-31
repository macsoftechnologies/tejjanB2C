import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BroadcastserviceService } from "src/app/services/broadcastservice.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-b2b-sign-in",
  templateUrl: "./b2b-sign-in.component.html",
  styleUrls: ["./b2b-sign-in.component.scss"]
})
export class B2bSignInComponent implements OnInit {
  signinForm: FormGroup;
  user: any;
  showHideLogin: boolean;
  signInFormValidationFlag: any;
  isCheckout : any

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private broadcastservice: BroadcastserviceService,
    private activeModal: NgbModal
  ) {}

  ngOnInit() {
    this.loadSigninForm();
  }

  //  **** Signin Form  Declarations ****
  loadSigninForm() {
    this.signinForm = this.formBuilder.group({
      userName: ["",Validators.required],
      password: ["", Validators.required]
    });
  }

  //  ***** Navigate to search page *****
  login() {
    this.signInFormValidationFlag = this.signinForm.valid ? false : true ;
    if(!this.signInFormValidationFlag) {
      let signInObj = {
        // type:"B2B",
        userName: this.signinForm.value.userName,
        password: this.signinForm.value.password
      }
        console.log("signInObj----", signInObj);
        this.router.navigateByUrl("b2b/search");
    }
    this.showHideLogin = true;
    let userData = {
      name: "abcd",
      address: "vizag"
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    this.user = localStorage.getItem("userData");
    this.isCheckout = localStorage.getItem("isCheckOut")
    if (this.user == null && this.user == undefined) {
      // this.broadcastservice.showHideLogin.emit(false);
        // if(this.isCheckout == true){
        //   this.router.navigateByUrl('b2c/checkout')
        // }else{
        //   this.router.navigateByUrl('b2c/search')
        // }
      
        this.router.navigateByUrl('b2c/login');
    } else {
      // this.broadcastservice.showHideLogin.emit(true);
    }

    if (localStorage.getItem("modulepath").includes("b2c")) {
      localStorage.setItem("stepperVal", 0 + "");
      this.broadcastservice.stepperValue.emit(0);
      if(!this.signInFormValidationFlag) {
        // let signInObj = {
        //   // type:"B2C",
        //   userName: this.signinForm.value.userName,
        //   password: this.signinForm.value.password
        // }
        // console.log("signInObj----", signInObj);
        this.router.navigateByUrl("b2c/checkout");
        this.activeModal.dismissAll("success");
      }
      else {

      }
    } 
    else {
      localStorage.setItem("stepperVal", 0 + "");
      this.broadcastservice.stepperValue.emit(0);
      // this.router.navigateByUrl("b2b/search");
    }
  }
}
