export interface Location{
    type?: string,
    success?: string,
    
    location_id: string,
    location: {
        type: string,
        value: string,
        x: number,
        y: number,
        isNull: boolean,
        null: boolean
    },
    country:string,
    region:string,
    city:string,
    areacode:string,
}
