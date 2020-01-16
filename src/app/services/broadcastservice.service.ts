import { Injectable, EventEmitter } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class BroadcastserviceService {
  constructor() {}

  showHideLogin = new EventEmitter<any>();
  customStepper = new EventEmitter<boolean>();
  stepperValue = new EventEmitter<number>();
}
