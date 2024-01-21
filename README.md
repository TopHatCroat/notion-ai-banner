# Notion-AI-Banner

Notion-AI-Banner is an app that automates the generation of image banners for Notion pages by using OpenAI's Dall-e
image generation. 

## Features

- Various ways to run the app: as a standalone script, as a server or as a scheduled task.
- Customizable prompt generation and page filtering defined in `notion-transformer.js`.
- GitHub Actions workflow to automatically generate banners for all pages on a daily basis or a single page on demand.
- Currently it requires images to be uploaded to S3 due to [Notion API not supporting image uploads yet](https://developers.notion.com/reference/file-object).

## Technologies and libraries used

- Node.js
- Express
- yargs
- axios
- Dotenv
- OpenAI
- cron
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
- `notion-transformer.js`: Contains the logic to transform Notion page data into a format that can be used by the
  service. Change this file to customize the prompt you send to Dall-e model to generate banners.

## Installation

To set up the project for development:

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Create an `.env` file based on the provided `.env.template` with Notion, OpenAI API and S3 credentials.
4. Run the service using `npm start`.

## Usage

#### Run single page banner generation

* `node app.js generate-single --id=[Notion Page ID]` - Generate banner for a page with a given ID
* `node app.js generate-all` - Generate banners for all pages based on the filter in `notion-transformer.js`

#### Run server

* `node app.js serve` - Run the server

The service exposes endpoints to manually generate banners and trigger the automatic generation process:

- POST `/generate-banner`: Manually request banner generation for a specific page.
- POST `/trigger-banner-generation`: Manually trigger the periodic banner generation task.

Refer to `requests.http` for examples of how to use these endpoints.

## Contributing

Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
