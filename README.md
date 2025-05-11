# TAO Subnet Alpha Dashboard

A real-time dashboard for monitoring and evaluating TAO subnets. This project provides a dynamic table interface to display subnet metrics and performance data from the TAO network.

## Features

- Real-time subnet data display
- Dynamic table with sorting and filtering
- Live API integration with TAO.app
- Local development server with proxy support
- Responsive design

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with your API key (see `.env.example`)
4. Start the development server: `npm start`

## Development

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Express
- API: TAO.app integration

## Troubleshooting
- If the application fails to load data, check the following:
  - Ensure the local server is running.
  - Verify network connectivity and API endpoint availability.

## Deployment
- Deploy the application on platforms like Netlify or Vercel for easy hosting.
- Ensure CORS policies are correctly configured if the API is hosted on a different domain. 