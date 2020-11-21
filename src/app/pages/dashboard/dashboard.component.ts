import { Component, OnInit } from "@angular/core";
import Chart from 'chart.js';
import { AggregatedTimeSeries } from 'src/app/models/AggregatedTimeSeries';
import { LocationResponse } from 'src/app/models/LocationResponse';
import { Measurement } from 'src/app/models/Measurement';
import { MeasurementResponse } from 'src/app/models/MeasurementReponse';
import { Sensor } from 'src/app/models/Sensor';
import { SensorResponse } from 'src/app/models/SensorResponse';
import { TimeSeries } from 'src/app/models/TimeSeries';
import { GraphService } from 'src/app/services/graph.service';
import { SOSService } from 'src/app/services/sos.service';

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  public canvas : any;
  public ctx;
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

  public typesMap = {
      "all": 0,
      "min": 1,
      "max": 2,
      "avg": 3,
      "range": 4,
      "sum": 5
  }

  public clicked0: boolean = true;
  public clicked: boolean = false;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  public clicked3: boolean = false;
  public clicked4: boolean = false;

  public plotClicked: boolean = false;

  public allSensors: Sensor[];
  public allLocations: Location[];
  public allMeasurements: Measurement[];

  constructor(private _sosService: SOSService, private _graphService: GraphService) {}

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

    var chart_labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    // this.datasets = [
    //  this.datasets[0] = [100, 70, 90, 70, 85, 60, 90, 100, 80, 95, 70, 120];
    //  this.datasets[1] = [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120];
    //  this.datasets[2] = [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130];
    //  this.datasets[3] = []
    // ];
    this.data = this.datasets[0];

    const options = {
      chart_labels: chart_labels,
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

    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.options.scales.yAxes[0].ticks.suggestedMax = max;
    this.myChartData.options.scales.yAxes[0].ticks.suggestedMin = min;
    
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

  async getAggregatedData(options, index){
    let res: AggregatedTimeSeries[];
    let response = await this._sosService.getAggregation(options);
    res = response.payload;
    this.datasets[index] = res.map(sensorData => sensorData.aggregationValue);
  }

  async getSensorData(id){
    
    for(const [key, value] of Object.entries(this.typesMap)){
      if(value === 0) continue;
      var options = {
        type: key,
        size: 5,
        id: id
      }

      await this.getAggregatedData(options, value);
      // this.updateOptions(value);
    }
  }

  async getAllSensorData(id){
    let res: TimeSeries[];
    let response = await this._sosService.getTimeSeriesBySensorId({id: id});
    res = response.payload;
    this.datasets[0] = res.map(sensorData => sensorData.measurementValue);
    this.updateOptions(0);
  }

  async syncAll(){
    await this.getAllSensors();
    // await this.getAllLocations();
    // await this.getAllMeasurements();
  }
}
