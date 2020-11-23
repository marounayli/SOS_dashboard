import { Component, OnInit } from "@angular/core";
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import Chart from 'chart.js';
import { AggregatedTimeSeries } from 'src/app/models/AggregatedTimeSeries';
import { AggragationResponse } from 'src/app/models/AggregationResponse';
import { AggregationPayload } from 'src/app/models/AggregatioPayload';
import { LocationResponse } from 'src/app/models/LocationResponse';
import { Measurement } from 'src/app/models/Measurement';
import { MeasurementResponse } from 'src/app/models/MeasurementReponse';
import { Sensor } from 'src/app/models/Sensor';
import { SensorResponse } from 'src/app/models/SensorResponse';
import { TimeSeries } from 'src/app/models/TimeSeries';
import { DateService } from 'src/app/services/date.service';
import { GraphService } from 'src/app/services/graph.service';
import { SOSService } from 'src/app/services/sos.service';

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styles: [
    `
    .form-group.hidden {
      width: 0;
      margin: 0;
      border: none;
      padding: 0;
    }
    .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.focused {
      background-color: #e6e6e6;
    }
    .custom-day.range, .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }
  `
  ]
})



export class DashboardComponent implements OnInit {
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
 
  public canvas : any;
  public ctx;
  public types = ["min", "max", "avg", "range", "sum"]
  public selectedType: string = '';
  public aggregationSize: any;

  public datasets: any = [
    [],
    [],
    [],
    [],
    [],
    []
  ]
  public data: any;
  public myChartData;
  public chartLabels: any = [
    [],
    [],
    [],
    [],
    [],
    []
  ]

  public typesMap = {
      "all": 0,
      "min": 1,
      "max": 2,
      "avg": 3,
      "range": 4,
      "sum": 5
  }

  public datePicker: NgbDateStruct;

  public clicked0: boolean = true;
  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;
  public clicked4: boolean = false;

  public plotClicked: boolean = false;
  public clickedSensor: number;

  public allSensors: Sensor[];
  public allLocations: Location[];
  public allMeasurements: Measurement[];

  constructor(private _sosService: SOSService, private _graphService: GraphService, private _dateService: DateService,
    private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    }

 async ngOnInit() {

    await this.syncAll();
    
    var graphOptions = {
      min: 60,
      max: 20,
      paddingX: 20,
      paddingY: 20
    }

    var gradientChartOptionsConfigurationWithTooltipRed = this._graphService.generateGraph(graphOptions);

    this.canvas = document.getElementById("chartBig1");
    this.ctx = this.canvas.getContext("2d");

    var gradientStroke = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, 'rgba(233,32,16,0.2)');
    gradientStroke.addColorStop(0.4, 'rgba(233,32,16,0.0)');
    gradientStroke.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

    // var chart_labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    // this.datasets = [
    //  this.datasets[0] = [100, 70, 90, 70, 85, 60, 90, 100, 80, 95, 70, 120];
    //  this.datasets[1] = [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120];
    //  this.datasets[2] = [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130];
    //  this.datasets[3] = []
    // ];
    this.data = this.datasets[0];

    const options = {
      chart_labels: this.chartLabels[0],
      gradientStroke: gradientStroke,
      data: this.data
    }

    var config = this._graphService.generateGraphConfig(gradientChartOptionsConfigurationWithTooltipRed, options);
    this.myChartData = new Chart(this.ctx, config);
  }

  public updateOptions(nb) {
    this.data = this.datasets[nb];

    const max = Math.max.apply(Math, this.data);
    const min = Math.min.apply(Math, this.data);
    const title = Object.keys(this.typesMap).find(key => this.typesMap[key] === nb);

    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.config.data.labels = this.chartLabels[nb];
    this.myChartData.options.scales.yAxes[0].ticks.suggestedMax = max;
    this.myChartData.options.scales.yAxes[0].ticks.suggestedMin = min;
    this.myChartData.config.data.datasets[0].label = title + " chart";
    
    this.myChartData.update();
  }

  async getAllSensors(){
    let res: SensorResponse;
    res = await this._sosService.getAllSensors();
    this.allSensors = res.payload;
  }

  async getAllLocations(){
    let res: LocationResponse;
    res = await this._sosService.getAllLocations();
    this.allLocations = res.payload;
  }

  async getAllMeasurements(){
    let res: MeasurementResponse;
    res = await this._sosService.getAllMeasurements();
    this.allMeasurements = res.payload;
  }

  // async getAggregatedData(options, index){
  //   let res: AggregatedTimeSeries[];
  //   let response = await this._sosService.getAggregation(options);
  //   res = response.payload;
  //   this.datasets[index] = res.map(sensorData => sensorData.aggregationValue);
  //   this.chartLabels[index] = res.map(sensorData => this._dateService.handleAggregationDate(sensorData.lowDate, sensorData.highDate));

  // }

  // async getSensorData(id){
    
  //   for(const [key, value] of Object.entries(this.typesMap)){
  //     if(value === 0) continue;
  //     var options = {
  //       type: key,
  //       size: 2,
  //       id: id
  //     }

  //     await this.getAggregatedData(options, value);
  //   }
  // }

  async getAllSensorData(id){

    let res: AggragationResponse;

    let dates = this._dateService.parseFromToDates(this.fromDate, this.toDate);

    const options = {
      aggregationSize: 4,
      sensorId: id,
      aggregations: ['sum', 'avg', 'range', 'min', 'max'],
      startDateTime: dates.fromDate,
      endDateTime: dates.toDate
    }

    res = await this._sosService.getSensorAggregations(options);
    // console.log(res);
    this.updateDatasets(res.payload);
    this.updateLabels(res.payload);

    this.updateOptions(0);
  }

  async syncAll(){
    await this.getAllSensors();
  }

  updateDatasets(payload: AggregationPayload){
    this.datasets[0] = payload.original.map(originalData => originalData.measurementValue);
    this.datasets[1] = payload.aggregationMap.min.map(minData => minData.aggregationValue);
    this.datasets[2] = payload.aggregationMap.max.map(maxData => maxData.aggregationValue);
    this.datasets[3] = payload.aggregationMap.avg.map(avgData => avgData.aggregationValue);
    this.datasets[4] = payload.aggregationMap.range.map(rangeData => rangeData.aggregationValue);
    this.datasets[5] = payload.aggregationMap.sum.map(sumData => sumData.aggregationValue);
  }

  updateLabels(payload: AggregationPayload){
    this.chartLabels[0] = payload.original.map(originalData => this._dateService.convertDate(originalData.measurementDate));
    this.chartLabels[1] = payload.aggregationMap.min.map(minData => this._dateService.handleAggregationDate(minData.lowDate, minData.highDate));
    this.chartLabels[2] = payload.aggregationMap.max.map(maxData => this._dateService.handleAggregationDate(maxData.lowDate, maxData.highDate));
    this.chartLabels[3] = payload.aggregationMap.avg.map(avgData => this._dateService.handleAggregationDate(avgData.lowDate, avgData.highDate));
    this.chartLabels[4] = payload.aggregationMap.range.map(rangeData => this._dateService.handleAggregationDate(rangeData.lowDate, rangeData.highDate));
    this.chartLabels[5] = payload.aggregationMap.sum.map(sumData => this._dateService.handleAggregationDate(sumData.lowDate, sumData.highDate));
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

}
