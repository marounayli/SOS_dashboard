import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AggragationResponse } from '../models/AggregationResponse';
import { SOSResponse } from '../models/SOSResponse';
import { baseUrl } from '../shared/baseUrl';


@Injectable({
  providedIn: 'root'
})
export class SOSService {

  constructor(private _http: HttpClient) { }

  getAllLocations(): Promise<SOSResponse>{
    const promise = new Promise<SOSResponse>((resolve, reject) => {
      this._http.get<SOSResponse>(baseUrl + "/location/all").toPromise()
        .then(res => resolve(res), error => reject(error));
   });
   return promise;
  }

  getAllMeasurements(): Promise<SOSResponse> {
    const promise = new Promise<SOSResponse>((resolve, reject) => {
       this._http.get<SOSResponse>(baseUrl + "/measurement/all").toPromise()
         .then(res => resolve(res), error => reject(error));
    });
    return promise;
   }

  getAllSensors(): Promise<SOSResponse> {
   const promise = new Promise<SOSResponse>((resolve, reject) => {
      this._http.get<SOSResponse>(baseUrl + "/sensor/all").toPromise()
        .then(res => resolve(res), error => reject(error));
   });
   return promise;
  }

  getSensorsByCity(options){
    const city = options.city;
    const promise = new Promise((resolve, reject) => {
      this._http.get<any>(baseUrl + '/sensor/city/' + city).toPromise()
        .then(res => resolve(res), error => reject(error));
    })
    
    return promise;
  }

  getSensorById(options) {
    const id = options.id;
    const promise = new Promise((resolve, reject) => {
      this._http.get<any>(baseUrl + '/sensor/id/' + id).toPromise()
        .then(res => resolve(res.payload), error => reject(error));
    });

    return promise;
  }

  getSensorByRegion(options){
    const region = options.region;
    const promise = new Promise((resolve, reject) => {
      this._http.get<any>(baseUrl + '/sensor/region/' + region).toPromise()
        .then(res => resolve(res.payload), error => reject(error));
    });

    return promise;
  }

  getSensorAggregations(options): Promise<AggragationResponse>{

    const promise = new Promise<AggragationResponse>((resolve, reject) => {
      this._http.post<AggragationResponse>(baseUrl + "/ts/aggregations", options).toPromise()
        .then(res => resolve(res), error => reject(error));
    });

    return promise;
  }


  downloadZipFile(options): Observable<any>{
      return this._http.post<any>(baseUrl + '/ts/downloadZip', options, {...options, responseType: 'arrayBuffer'});
  }

  // downloadZipFile(options): Promise<any> {
  //   const promise = new Promise<any>((resolve, reject) => {
  //     this._http.post<any>(baseUrl + '/ts/downloadZip', options).toPromise()
  //       .then(res => resolve(res), error => reject(error));
  //   });

  //   return promise;
  // }


  errorHandler(error: HttpErrorResponse){
    return throwError(error.message || 'server error');
  }
}
