import { Measurement } from './Measurement';

export interface Sensor {
    type?: string,
    success?: string,
    
    sensorId: number,
    location: Location,
    measurement: Measurement,
    specification: string,
    description: string 
}