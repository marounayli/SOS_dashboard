import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Sensor } from '../models/Sensor';

@Injectable({
  providedIn: 'root'
})
export class SOSService {

  private _url: string = "https://backendsos.herokuapp.com";
  data = [];
  constructor(private _http: HttpClient) { }

  getAllLocations() {
    const promise = new Promise((resolve, reject) => {
      this._http.get<any>(this._url + "/location/all").toPromise()
        .then(res => resolve(res), error => reject(error));
   });
   return promise;
  }

  getAllMeasurements() {
    const promise = new Promise((resolve, reject) => {
       this._http.get<any>(this._url + "/measurement/all").toPromise()
         .then(res => resolve(res), error => reject(error));
    });
    return promise;
   }

  getAllSensors() {
   const promise = new Promise((resolve, reject) => {
      this._http.get<any>(this._url + "/sensor/all").toPromise()
        .then(res => resolve(res.payload), error => reject(error));
   });
   return promise;
  }

  getSensorsByCity(options): Observable<Sensor[]>{
    const city = options.city;
    return this._http.get<Sensor[]>(this._url + '/sensor/city/' + city)
    .pipe(
      retry(3),
      catchError(this.errorHandler));
  }

  getSensorById(options): Observable<Sensor>{
    const id = options.id;
    return this._http.get<Sensor>(this._url + '/sensor/id/' + id)
    .pipe(
      retry(3),
      catchError(this.errorHandler));
  }

  getSensorByRegion(options): Observable<Sensor[]>{
    const region = options.region;
    return this._http.get<Sensor[]>(this._url + '/sensor/region/' + region)
    .pipe(
      retry(3),
      catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse){
    return throwError(error.message || 'server error');
  }
}
