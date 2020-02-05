import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BroadcastserviceService } from "src/app/services/broadcastservice.service";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AlrajhiumrahService } from 'src/app/services/alrajhiumrah.service';

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
  loginResp: any;
  b2cSignInResp: any;
  userValidationFlag: boolean = false;

  constructor(private tejaanServices: AlrajhiumrahService,
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
        type:"B2C",
        userName: this.signinForm.value.userName,
        password: this.signinForm.value.password
      }

      this.tejaanServices.login(signInObj).subscribe(data => {
        this.loginResp = data;

        console.log("login" , data.headers.keys());
        console.log("location------" , location);
        if(this.loginResp.body.status === 200) {
          this.showHideLogin = true;
          localStorage.setItem("userData", JSON.stringify(signInObj));
          this.user = localStorage.getItem("userData");
          this.isCheckout = localStorage.getItem("isCheckOut");
          if (this.user == null && this.user == undefined) {
            this.broadcastservice.showHideLogin.emit(false);
              this.router.navigateByUrl('b2c/login');
          } else {
            this.broadcastservice.showHideLogin.emit(true);
          }
          if(location.pathname === "/b2c/signin") {
            // console.log("hiii");
            this.userValidationFlag = false;
            this.router.navigateByUrl("b2b/search");
          }
          else {
            // console.log("byeee");
            this.router.navigateByUrl("b2c/checkout");
            this.activeModal.dismissAll("success");
          }

        }
        else {
          this.userValidationFlag = true;
        }
      });
        
    }
    
  }

  public navigateToSignUp(): void {
    this.router.navigateByUrl("b2b/signup");
  }
}
