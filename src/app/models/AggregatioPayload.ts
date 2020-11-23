import { AggregatedTimeSeries } from './AggregatedTimeSeries';
import { TimeSeries } from './TimeSeries';

export interface AggregationPayload{
        original: TimeSeries[],
        aggregationMap: {
            avg?: AggregatedTimeSeries[],
            sum?: AggregatedTimeSeries[],
            min?: AggregatedTimeSeries[],
            max?: AggregatedTimeSeries[],
            range?: AggregatedTimeSeries[]
        }
}