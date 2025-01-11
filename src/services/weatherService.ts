import axios from 'axios';
import { Location, WeatherCondition, WeatherComparison, Wind } from '../types/weather';

const NWS_API_BASE = 'https://api.weather.gov';
const USER_AGENT = 'YesterdaysWeather/1.0 (contact@yesterdaysweather.com)';

export class WeatherService {
    private async getGridPoint(location: Location) {
        const response = await axios.get(
            `${NWS_API_BASE}/points/${location.latitude},${location.longitude}`,
            { headers: { 'User-Agent': USER_AGENT } }
        );
        return response.data.properties;
    }

    private async getForecast(gridPoint: any): Promise<WeatherCondition> {
        const response = await axios.get(gridPoint.forecastHourly, {
            headers: { 'User-Agent': USER_AGENT }
        });

        const currentPeriod = response.data.properties.periods[0];
        return {
            temperature: {
                value: currentPeriod.temperature,
                unit: currentPeriod.temperatureUnit
            },
            wind: {
                speed: currentPeriod.windSpeed.split(' ')[0],
                direction: currentPeriod.windDirection,
                unit: 'mph'
            },
            description: currentPeriod.detailedForecast,
            shortForecast: currentPeriod.shortForecast
        };
    }

    private generateComparison(today: WeatherCondition, yesterday: WeatherCondition): string {
        const phrases: string[] = [];

        // Temperature comparison
        phrases.push(this.getTemperaturePhrase(today, yesterday));

        // Wind comparison
        const windPhrase = this.getWindPhrase(today, yesterday);
        if (windPhrase) phrases.push(windPhrase);

        // Weather condition changes
        const conditionPhrase = this.getConditionPhrase(today, yesterday);
        if (conditionPhrase) phrases.push(conditionPhrase);

        // Join phrases naturally
        return phrases.join(' ').trim();
    }

    private getTemperaturePhrase(today: WeatherCondition, yesterday: WeatherCondition): string {
        const tempDiff = today.temperature.value - yesterday.temperature.value;
        const timeOfDay = this.getTimeOfDay();

        if (Math.abs(tempDiff) < 3) {
            return `${timeOfDay} feels about the same as yesterday`;
        }

        const magnitude = this.getTemperatureMagnitude(Math.abs(tempDiff));
        const sensation = this.getTemperatureSensation(today.temperature.value);

        return tempDiff > 0
            ? `${timeOfDay} is ${magnitude} warmer than yesterday${sensation ? ` and ${sensation}` : ''}`
            : `${timeOfDay} is ${magnitude} cooler than yesterday${sensation ? ` and ${sensation}` : ''}`;
    }

    private getTemperatureSensation(temp: number): string {
        if (temp >= 85) return "quite hot";
        if (temp >= 75) return "warm";
        if (temp <= 32) return "freezing";
        if (temp <= 45) return "quite cold";
        return "";
    }

    private getTimeOfDay(): string {
        const hour = new Date().getHours();
        if (hour < 12) return "This morning";
        if (hour < 17) return "This afternoon";
        return "This evening";
    }

    private getTemperatureMagnitude(diff: number): string {
        if (diff >= 15) return "much";
        if (diff >= 8) return "notably";
        if (diff >= 3) return "slightly";
        return "";
    }

    private getWindPhrase(today: WeatherCondition, yesterday: WeatherCondition): string {
        const speedDiff = today.wind.speed - yesterday.wind.speed;

        // Only mention wind if it's significant
        if (today.wind.speed >= 15 || Math.abs(speedDiff) >= 5) {
            if (speedDiff > 5) return `with stronger winds`;
            if (speedDiff < -5) return `with calmer winds`;
            if (today.wind.speed >= 15) return `and still quite windy`;
        }

        return "";
    }

    private getConditionPhrase(today: WeatherCondition, yesterday: WeatherCondition): string {
        const conditions = this.categorizeCondition(today.shortForecast);
        const yesterdayConditions = this.categorizeCondition(yesterday.shortForecast);

        if (conditions === yesterdayConditions) {
            return this.getSignificantWeatherPhrase(conditions, today.shortForecast);
        }

        return this.getWeatherChangePhrase(conditions, yesterdayConditions, today.shortForecast);
    }

    private categorizeCondition(forecast: string): string {
        const lower = forecast.toLowerCase();
        if (lower.includes('storm') || lower.includes('thunder')) return 'stormy';
        if (lower.includes('rain') || lower.includes('shower')) return 'rainy';
        if (lower.includes('snow') || lower.includes('sleet')) return 'snowy';
        if (lower.includes('cloud')) return 'cloudy';
        if (lower.includes('sun') || lower.includes('clear')) return 'clear';
        return 'other';
    }

    private getSignificantWeatherPhrase(condition: string, forecast: string): string {
        switch (condition) {
            case 'stormy':
                return `with continuing storms`;
            case 'rainy':
                return `with ongoing rain`;
            case 'snowy':
                return `with continuing snow`;
            case 'clear':
                return `with clear skies again`;
            default:
                return '';
        }
    }

    private getWeatherChangePhrase(current: string, previous: string, forecast: string): string {
        if (current === 'clear' && previous !== 'clear') {
            return `with skies clearing up`;
        }
        if (current === 'stormy') {
            return `with storms moving in`;
        }
        if (current === 'rainy' && previous !== 'rainy') {
            return `with rain developing`;
        }
        if (current === 'cloudy' && previous === 'clear') {
            return `but clouds are moving in`;
        }
        if (current === 'snowy' && previous !== 'snowy') {
            return `with snow starting`;
        }

        return forecast.toLowerCase();
    }

    public async compareWeather(location: Location): Promise<WeatherComparison> {
        const gridPoint = await this.getGridPoint(location);
        const today = await this.getForecast(gridPoint);

        // For demo purposes, using current conditions as yesterday's
        // TODO: Implement historical data retrieval
        const yesterday = {
            ...today,
            temperature: { ...today.temperature, value: today.temperature.value - 5 },
            wind: { ...today.wind, speed: today.wind.speed - 7 },
            shortForecast: "Partly Cloudy"
        };

        return {
            today,
            yesterday,
            comparison: this.generateComparison(today, yesterday)
        };
    }
} 