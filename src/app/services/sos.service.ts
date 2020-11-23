import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { AggragationResponse } from '../models/AggregationResponse';
import { LocationResponse } from '../models/LocationResponse';
import { MeasurementResponse } from '../models/MeasurementReponse';
import { SensorResponse } from '../models/SensorResponse';

@Injectable({
  providedIn: 'root'
})
export class SOSService {

  private _url: string = "https://backendsos.herokuapp.com";
  data = [];
  constructor(private _http: HttpClient) { }

  getAllLocations(): Promise<LocationResponse>{
    const promise = new Promise<LocationResponse>((resolve, reject) => {
      this._http.get<LocationResponse>(this._url + "/location/all").toPromise()
        .then(res => resolve(res), error => reject(error));
   });
   return promise;
  }

  getAllMeasurements(): Promise<MeasurementResponse> {
    const promise = new Promise<MeasurementResponse>((resolve, reject) => {
       this._http.get<MeasurementResponse>(this._url + "/measurement/all").toPromise()
         .then(res => resolve(res), error => reject(error));
    });
    return promise;
   }

  getAllSensors(): Promise<SensorResponse> {
   const promise = new Promise<SensorResponse>((resolve, reject) => {
      this._http.get<SensorResponse>(this._url + "/sensor/all").toPromise()
        .then(res => resolve(res), error => reject(error));
   });
   return promise;
  }

  getSensorsByCity(options){
    const city = options.city;
    const promise = new Promise((resolve, reject) => {
      this._http.get<any>(this._url + '/sensor/city/' + city).toPromise()
        .then(res => resolve(res), error => reject(error));
    })
    
    return promise;
  }

  getSensorById(options) {
    const id = options.id;
    const promise = new Promise((resolve, reject) => {
      this._http.get<any>(this._url + '/sensor/id/' + id).toPromise()
        .then(res => resolve(res.payload), error => reject(error));
    });

    return promise;
  }

  getSensorByRegion(options){
    const region = options.region;
    const promise = new Promise((resolve, reject) => {
      this._http.get<any>(this._url + '/sensor/region/' + region).toPromise()
        .then(res => resolve(res.payload), error => reject(error));
    });

    return promise;
  }

  // getTimeSeriesBySensorId(options): Promise<TimeSeriesResponse>{
  //   const id = options.id;
  //   const promise = new Promise<TimeSeriesResponse>((resolve, reject) => {
  //     this._http.get<TimeSeriesResponse>(this._url + "/ts/sensId/" + id).toPromise()
  //       .then(res => resolve(res), error => reject(error));
  //   });

  //   return promise;
  // }

  // getAggregation(options): Promise<AggregatedTimeSeriesResponse>{
  //   const id = options.id;
  //   const size = options.size;
  //   const type = options.type; 

  //   const promise = new Promise<AggregatedTimeSeriesResponse>((resolve, reject) => {
  //     this._http.get<AggregatedTimeSeriesResponse>(this._url + "/ts/" + type + "/sensId/" + id + "/" + size).toPromise()
  //       .then(res => resolve(res), error => reject(error));
  //   });

  //   return promise;
  // }

  getSensorAggregations(options): Promise<AggragationResponse>{

    const promise = new Promise<AggragationResponse>((resolve, reject) => {
      this._http.post<AggragationResponse>(this._url + "/ts/aggregations", options).toPromise()
        .then(res => resolve(res), error => reject(error));
    });

    return promise;
  }


  errorHandler(error: HttpErrorResponse){
    return throwError(error.message || 'server error');
  }
}
