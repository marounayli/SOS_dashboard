export interface Measurement{
    type: string,
    success: string,
    payload: {
        measurement_id: string, 
        type: string, 
        measurement_unit: string
    }
}