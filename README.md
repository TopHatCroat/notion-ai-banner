# Notion-AI-Banner

Notion-AI-Banner is a service that automates the generation of image banners for Notion pages by using OpenAI's Dall-e
image generation capabilities. This service detects new pages within a Notion database at regular intervals and creates
summary banners that align with the content and specified tagging of the Notion pages.

## Features

- Automatic detection of new pages in a Notion database at 15-minute intervals.
- Image banner generation based on content summary and specified Notion properties.
- Customizable influence of Notion properties on banner style.
- Generated images are 1500x600 pixels in resolution.

## Technologies

- Node.js
- Express
- axios
- Dotenv
- OpenAI
- cron
- ejs
- CSS3
- HTML
- Bootstrap
- Socket.io
- sharp

## Project Structure

Below is a description of key files and directories in the project:

- `/package.json`: Contains project metadata and dependencies.
- `/.env.template`: Template configuration and sensitive credentials. Fill it up with your own credentials and rename it
  to `.env`.
- `/app.js`: The entry point of the application server.
- `/controllers`: Contains the logic to handle banner generation endpoints.
- `/routes`: Defines the HTTP endpoints for the service.
- `/requests.http`: A collection of HTTP requests for testing purposes.
- `/tasks`: Contains scheduled tasks, such as the cron job for periodic checks.
- `/utils`: Utility modules for interacting with external APIs.
- `/services`: Business logic related to banner generation.
- `/banners`: Directory where generated banners are stored.

## Installation

To set up the project for development:

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Create an `.env` file based on the provided `.env.template` with Notion, OpenAI API and S3 credentials.
4. Run the service using `npm start`.

## Usage

The service exposes endpoints to manually generate banners and trigger the automatic generation process:

- POST `/generate-banner`: Manually request banner generation for a specific page.
- POST `/trigger-banner-generation`: Manually trigger the periodic banner generation task.

Refer to `requests.http` for examples of how to use these endpoints.

## Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

This project is licensed under the ISC License - see the `LICENSE` file for details.