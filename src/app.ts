import express, { RequestHandler } from 'express';
import cors from 'cors';
import { WeatherService } from './services/weatherService';
import { Location, WeatherComparison } from './types/weather';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const weatherService = new WeatherService();

interface WeatherQueryParams {
    latitude?: string;
    longitude?: string;
}

const compareWeather: RequestHandler = async (req, res) => {
    try {
        const latitude = parseFloat(req.query.latitude as string);
        const longitude = parseFloat(req.query.longitude as string);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({
                error: 'Invalid coordinates. Please provide valid latitude and longitude as query parameters.'
            });
        }

        const location: Location = { latitude, longitude };
        const comparison = await weatherService.compareWeather(location);

        // Set cache control headers - cache for 5 minutes since weather data updates hourly
        res.set('Cache-Control', 'public, max-age=300');
        res.json(comparison);
    } catch (error) {
        console.error('Error comparing weather:', error);
        res.status(500).json({
            error: 'Failed to compare weather conditions'
        });
    }
};

app.get('/api/weather/compare', compareWeather);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 