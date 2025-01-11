# Yesterday's Weather Server

A Node.js API server that compares today's weather with yesterday's conditions using the National Weather Service API.

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
POST /api/weather/compare
```

Request body:

```json
{
  "latitude": number,
  "longitude": number
}
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

## Development

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
