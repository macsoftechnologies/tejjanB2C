import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpHeaders,
  HttpResponse
} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { throwError, Observable } from 'rxjs';
import { map, tap } from "rxjs/operators";
// import "rxjs/add/operator/catch";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlrajhiumrahService {
  baseUrl = environment.baseUrl;
  baseUrl1 = environment.baseUrl1;
  constructor(private http: HttpClient,
    private pageTitle: Title) { }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  public errorHandler(error: HttpErrorResponse) {
    if (error.status === 404)
      return throwError("Url is not Found");
  }

  setPageTitle(title: string) {
    this.pageTitle.setTitle(title);
  }

  /* get hotel location static data */
  getSearchLookup(): Observable<any> {
    return this.http
      .get(this.baseUrl + "search/lookup")
      .pipe(map(this.extractData));
  }
  /* get hotel location static data */

  /* get transport static data */
  getTransportLookup(): Observable<any> {
    return this.http
      .get(this.baseUrl + "transport/lookup")
      .pipe(map(this.extractData));
  }
  /* get transport static data */

  /* get ground service static data */
  getGroundServiceLookup(): Observable<any> {
    return this.http
      .get(this.baseUrl + "ground/lookup")
      .pipe(map(this.extractData));
  }
  /* get ground service static data */

  /* get hotel search data */
  getHotelSearch(data): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().append("request", JSON.stringify(data));

    return this.http.post<any>(this.baseUrl + "hotel/search", data,
      { observe: 'response' })
      .pipe(map(result => {
        return result;
      }));

  }
  /* get hotel search data */

  /* get hotel policy data */
  getHotelPolicy(data): Observable<any> {
    return this.http
      .post(this.baseUrl + "hotel/policy", data)
      .pipe(map(this.extractData));
  }
  /* get hotel policy data */

  /* get hotel availability data */
  getHotelAvailability(data): Observable<any> {
    return this.http
      .post(this.baseUrl + "hotel/availability", data, { observe: 'response' })
      .pipe(map(result => {
        return result;
       
      } ));
  }
  /* get hotel availability data */

  /* get hotel reservation data */
  getHotelReservation(data: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().append("request", JSON.stringify(data));

    return this.http
      .post(this.baseUrl + "hotel/reservation", data)
      .pipe(map(this.extractData));
  }
  /* get hotel reservation data */


  /* get transport reservation data */
  getTransportReservation(data: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().append("request", JSON.stringify(data));

    return this.http
      .post(this.baseUrl + "transport/reservation", data)
      .pipe(map(this.extractData));
  }
  /* get transport reservation data */

  /* get transport search data */
  getTransportSearch(data: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().append("request", JSON.stringify(data));

    return this.http
      .post(this.baseUrl + "transport/search", data , {observe: "response"})
    .pipe((resp) =>{
      return resp
    });
    // return this.http.get("../../assets/transportsearch.json");
  }
  /* get transport search data */

  /* get transport availability data */
  getTransportAvailability(data): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().append("request", JSON.stringify(data));

    return this.http
      .post(this.baseUrl + "transport/availability", data , {observe : "response"})
      .pipe((resp) =>{
        return resp
      });
  }
  /* get transport availability data */


  /* get ground service search data */
  getGroundServiceSearch(data: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().append("request", JSON.stringify(data));

    return this.http
      .post(this.baseUrl + "groundService/search", data , { observe: 'response' })
      .pipe(map(result => {
        return result;
       
      } ));

  }

  /* get ground service search data */

  /* get ground service availability data */
  getGroundServiceAvailability(data: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().append("request", JSON.stringify(data));
    return this.http
      .post(this.baseUrl + "groundService/availability", data , { observe: 'response' })
      .pipe(map(result => {
        return result;
       
      } ));

  }
  /* get ground service availability data */

  /* get ground service reservation data */
  getGroundServiceReservation(data: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().append("request", JSON.stringify(data));

    return this.http
      .post(this.baseUrl + "groundService/reservation", data)
      .pipe(map(this.extractData));
  }
  /* get ground service data */


  /* get country service data */
  getCountyList(): Observable<any> {
    return this.http
      .get(this.baseUrl + "country")
      .pipe(map(this.extractData));
  }
  /* get country service data */


  /* Hotel View Reservation  */
  getHotelViewReservation(data: any): Observable<any> {
    // return this.http.post(this.baseUrl + "hotel/viewreservation", data);

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().append("request", JSON.stringify(data));

    return this.http
      .post(this.baseUrl + "hotel/view/reservation", data ,  { observe: 'response' })
      .pipe(map(result => {
        return result;
       
      } ));
  }

  getCancelHotelReservation(data :any): Observable<any>{


    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().append("request", JSON.stringify(data));

    return this.http
      .post(this.baseUrl + "hotel/cancel/reservation", data ,  { observe: 'response' })
      .pipe(map(result => {
        return result;
       
      } ));

  }



  getGroundServiceViewReservation(data: any): Observable<any> {
    // return this.http.post(this.baseUrl + "hotel/viewreservation", data);

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().append("request", JSON.stringify(data));

    return this.http
      .post(this.baseUrl + "groundService/view/reservation", data ,  { observe: 'response' })
      .pipe(map(result => {
        return result;
       
      } ));
  }

  getTransPortViewReservation(data: any): Observable<any> {
    // return this.http.post(this.baseUrl + "hotel/viewreservation", data);

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().append("request", JSON.stringify(data));

    return this.http
      .post(this.baseUrl + "transport/view/reservation", data ,  { observe: 'response' })
      .pipe(map(result => {
        return result;
       
      } ));
  }

  // ********   E-visa  *************

  getEvisaDetails(data: any): Observable<any> {

    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().append("request", JSON.stringify(data));

    return this.http
      .post(this.baseUrl + "evisa/mutamerInfo", data)
      .pipe(map(this.extractData));
  }

  getEvisaLink(data: any): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set("Content-Type", "application/x-www-form-urlencoded");
    let params = new HttpParams().set('NationalityId', data.NationalityId)
    .set('PassportNo',data.PassportNo)
    .set('RequestId',data.RequestId)
    .set('Lang',data.Lang)
    .set('Token' , data.Token)
    ;
// let queryParamsStr ="evisa/visaLink?NationalityId="+data.NationalityId+"&PassportNo="+data.PassportNo
// +"&RequestId="+data.RequestId+"&Lang="+data.Lang;


    return this.http
      .get(this.baseUrl + "evisa/visaLink",{params:params}).pipe(map(this.extractData));
  }


  processPayment1(data:any):Observable<any>{

    console.log("Srvicedata" , data);
    return this.http
    .post(this.baseUrl + "payment",data).pipe(map(this.extractData));
  }

  registration(data: any):Observable<any> {
    return this.http.post(this.baseUrl1 + "register" , data , { observe: 'response' }).pipe(map(response =>{return response}));
  }

  login(data: any):Observable<any> {
    return this.http.post(this.baseUrl1 + "login",data ,{ observe: 'response' }).pipe(map(response =>{return response}));
  }

}

