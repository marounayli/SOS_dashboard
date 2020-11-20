import { Measurement } from './Measurement';

export interface Sensor{
    sensorId: number,
    location: Location,
    measurement: Measurement,
    specification: string,
    description: string 
}