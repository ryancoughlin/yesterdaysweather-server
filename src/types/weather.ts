export interface Location {
    latitude: number;
    longitude: number;
}

export interface Temperature {
    value: number;
    unit: string;
}

export interface Wind {
    speed: number;
    direction: string;
    unit: string;
}

export interface WeatherCondition {
    temperature: Temperature;
    wind: Wind;
    description: string;
    shortForecast: string;
}

export interface WeatherComparison {
    today: WeatherCondition;
    yesterday: WeatherCondition;
    comparison: string;
} 