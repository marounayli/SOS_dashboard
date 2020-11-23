import { AggregationPayload } from './AggregatioPayload';

export interface AggragationResponse {
    type: string,
    message: string,
    payload: AggregationPayload
}