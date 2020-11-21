import { Sensor } from './Sensor';

export interface SensorResponse {
    type: string,
    succes: string,
    payload: Sensor[]
}