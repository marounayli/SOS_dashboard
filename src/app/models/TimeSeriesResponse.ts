import { TimeSeries } from './TimeSeries';

export interface TimeSeriesResponse{
    type: string,
    message: string,
    payload: TimeSeries[]
}