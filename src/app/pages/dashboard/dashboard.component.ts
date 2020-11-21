import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from "@angular/core";
import Chart from 'chart.js';
import { catchError, retry } from 'rxjs/operators';
import { AggregatedTimeSeries } from 'src/app/models/AggregatedTimeSeries';
import { LocationResponse } from 'src/app/models/LocationResponse';
import { Measurement } from 'src/app/models/Measurement';
import { MeasurementResponse } from 'src/app/models/MeasurementReponse';
import { Sensor } from 'src/app/models/Sensor';
import { SensorResponse } from 'src/app/models/SensorResponse';
import { TimeSeries } from 'src/app/models/TimeSeries';
import { SOSService } from 'src/app/services/sos.service';

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  public canvas : any;
  public ctx;
  public datasets: any;
  public data: any;
  public myChartData;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;

  public allSensors: Sensor[];
  public allLocations: Location[];
  public allMeasurements: Measurement[];

 ;

  constructor(private _sosService: SOSService) {}

 async ngOnInit() {

    await this.syncAll();

    await this.updateTable();

    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(233,32,16,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };
    var chart_labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    this.datasets = [
      [100, 70, 90, 70, 85, 60, 75, 60, 90, 80, 110, 100],
      [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120],
      [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130]
    ];
    this.data = this.datasets[0];

    this.canvas = document.getElementById("chartBig1");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
    gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

    var config = {
      type: 'line',
      data: {
        labels: chart_labels,
        datasets: [{
          label: "My First dataset",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: '#ec250d',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: '#ec250d',
          pointBorderColor: 'rgba(255,255,255,0)',
          pointHoverBackgroundColor: '#ec250d',
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: this.data,
        }]
      },
      options: gradientChartOptionsConfigurationWithTooltipRed
    };
    this.myChartData = new Chart(this.ctx, config);
  }

  public updateOptions() {
    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.update();
  }

  async getAllSensors(){
    let res: SensorResponse;
    res = await this._sosService.getAllSensors();
    this.allSensors = res.payload;
    // console.log((Object.keys(this.allSensors[0])));
  }

  async getAllLocations(){
    let res: LocationResponse;
    res = await this._sosService.getAllLocations();
    this.allLocations = res.payload;
    // console.log(this.allLocations);
  }

  async getAllMeasurements(){
    let res: MeasurementResponse;
    res = await this._sosService.getAllMeasurements();
    this.allMeasurements = res.payload;
    // console.log(this.allMeasurements);
  }

  async syncAll(){
    await this.getAllSensors();
    await this.getAllLocations();
    await this.getAllMeasurements();
  }

  async printData(){


    let sensor1: AggregatedTimeSeries[];
    sensor1 = await this._sosService.getAggregation({id: 1, size:3, type:'prod'});
    console.log(sensor1);
    // sensor2 = await this._sosService.getSensorByRegion({region: 'Kfardebian'});
    // sensor3 = await this._sosService.getSensorsByCity({city: 'Faraya'});

    // console.log(sensor1.payload);
    // console.log(sensor2.payload);
    // console.log(sensor3.payload);
  }

  updateTable(){
    const data = this.allSensors;
  }
}
