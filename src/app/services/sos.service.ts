import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Sensor } from '../models/Sensor';
import { Location } from '../models/Location';
import { Measurement } from '../models/Measurement';

@Injectable({
  providedIn: 'root'
})
export class SOSService {

  url: string = "https://backendsos.herokuapp.com/";
  constructor(private _http: HttpClient) { }

  getAllLocations(): Observable<Location[]>{
    return this._http.get<Location[]>(this.url + 'location/all')
    .pipe(
      retry(3),
      catchError(this.errorHandler));
  }

  getAllMeasurements(): Observable<Measurement[]>{
    return this._http.get<Measurement[]>(this.url + 'measurement/all')
    .pipe(
      retry(3),
      catchError(this.errorHandler));
  }


  getAllSensors(): Observable<Sensor[]>{
    return this._http.get<Sensor[]>(this.url + 'sensor/all')
    .pipe(
      retry(3),
      catchError(this.errorHandler));
  }

  getSensorsByCity(options): Observable<Sensor[]>{
    const city = options.city;
    return this._http.get<Sensor[]>(this.url + 'sensor/city/' + city)
    .pipe(
      retry(3),
      catchError(this.errorHandler));
  }

  getSensorById(options): Observable<Sensor>{
    const id = options.id;
    return this._http.get<Sensor>(this.url + 'sensor/id/' + id)
    .pipe(
      retry(3),
      catchError(this.errorHandler));
  }

  getSensorByRegion(options): Observable<Sensor[]>{
    const region = options.region;
    return this._http.get<Sensor[]>(this.url + 'sensor/region/' + region)
    .pipe(
      retry(3),
      catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse){
    return throwError(error.message || 'server error');
  }
}
