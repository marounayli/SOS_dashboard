import { Measurement } from './Measurement';

export interface MeasurementResponse {
    type: string,
    success: string,
    payload: Measurement[]
}