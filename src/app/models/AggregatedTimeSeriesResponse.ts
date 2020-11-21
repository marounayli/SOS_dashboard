import { AggregatedTimeSeries } from './AggregatedTimeSeries';

export interface AggregatedTimeSeriesResponse {
    type: string,
    succes: string,
    payload: AggregatedTimeSeries[]
}