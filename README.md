# What's the weather now compared to yesterday? Because we all know how it felt.

## Features

- Compares current weather conditions with yesterday's weather
- Provides human-readable weather comparisons
- Uses real-time data from the National Weather Service
- RESTful API design
- TypeScript for type safety

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The server will start on port 3000 by default.

## API Endpoints

### Compare Weather

```
GET /api/weather/compare?latitude={lat}&longitude={lon}
```

Example:

```
GET /api/weather/compare?latitude=37.7749&longitude=-122.4194
```

Response:

```json
{
  "today": {
    "temperature": {
      "value": number,
      "unit": string
    },
    "wind": {
      "speed": number,
      "direction": string,
      "unit": string
    },
    "description": string,
    "shortForecast": string
  },
  "yesterday": {
    // Same structure as today
  },
  "comparison": string
}
```

Example comparison:

> "This morning is notably warmer than yesterday and quite hot with skies clearing up"

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
