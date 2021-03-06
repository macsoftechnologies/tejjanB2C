import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BroadcastserviceService } from "src/app/services/broadcastservice.service";
import { NgbActiveModal, NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { AlrajhiumrahService } from 'src/app/services/alrajhiumrah.service';
import { B2cSignUpComponent } from 'src/app/b2c/b2c-sign-up/b2c-sign-up.component';
import Swal from 'sweetalert2';

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
  modal: NgbModalRef;


  constructor(private tejaanServices: AlrajhiumrahService,
    private router: Router,
    private formBuilder: FormBuilder,
    private broadcastservice: BroadcastserviceService,
    private activeModal: NgbModal,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.broadcastservice.stepperValue.emit(0);
    localStorage.setItem("stepperVal",""+0);
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

        console.log("login" , data);
        console.log("location------" , location);
        if(this.loginResp.body.status === 200) {
          // this.showHideLogin = true;
          this.broadcastservice.showHideLogin.emit(true);
          localStorage.setItem('authorizationKey', JSON.stringify(this.loginResp.headers.get('authorization')));

          localStorage.setItem("userData", JSON.stringify(signInObj));
          this.activeModal.dismissAll("success");
          if(location.pathname === "/b2c/signin") {
            this.broadcastservice.stepperValue.emit(0);
            localStorage.setItem("stepperVal",""+0);
            this.router.navigateByUrl("b2c/search"); 
          }
          else {
            this.router.navigateByUrl("b2c/checkout");
            this.activeModal.dismissAll("success");
          }
        }
        else {
          this.broadcastservice.showHideLogin.emit(true);
          Swal.fire({
            // title: 'Sweet!',
            text: this.loginResp.body.message,
          });
        }
      });
        
    }
    
  }

  public navigateToSignUp(): void {
  
    this.activeModal.dismissAll("success");
     
       if( location.pathname === "/b2c/signin"){
        this.router.navigateByUrl("b2c/signup");
       }else{
        this.modal = this.modalService.open(B2cSignUpComponent);
       }

  }
}
