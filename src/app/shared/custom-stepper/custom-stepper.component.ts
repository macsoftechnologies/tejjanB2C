import { Component, OnInit } from "@angular/core";
import { BroadcastserviceService } from "../../services/broadcastservice.service";

@Component({
  selector: "app-custom-stepper",
  templateUrl: "./custom-stepper.component.html",
  styleUrls: ["./custom-stepper.component.scss"]
})
export class CustomStepperComponent implements OnInit {
  public isStepperVisible: boolean = false;
  public stepPageCount: number;

  constructor(private broadcastservice: BroadcastserviceService) {}

  ngOnInit() {
    this.broadcastservice.customStepper.subscribe(stepper => {
      this.isStepperVisible = stepper;
    });
    this.stepPageCount = parseInt(localStorage.getItem("stepperVal"));
    this.broadcastservice.stepperValue.subscribe(stepperVal => {
      this.stepPageCount = stepperVal;
    });
    // this.stepPageCount = parseInt(localStorage.getItem("stepperVal"));
  }
}
