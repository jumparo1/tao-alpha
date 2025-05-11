# TAO Subnet Evaluation App

This application displays and evaluates TAO subnets in a dynamic table using live data from the TAO API.

## Features
- Displays subnet data in a clean, responsive table.
- Allows searching for subnets by name or rank.
- Fetches live data from the TAO API.

## Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start the local server with `npm start`.
4. Open `index.html` in your browser.
5. Ensure the application fetches data from `http://localhost:3000/api`.

## Troubleshooting
- If the application fails to load data, check the following:
  - Ensure the local server is running.
  - Verify network connectivity and API endpoint availability.

## Deployment
- Deploy the application on platforms like Netlify or Vercel for easy hosting.
- Ensure CORS policies are correctly configured if the API is hosted on a different domain. 