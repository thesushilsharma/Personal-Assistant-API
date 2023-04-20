# Personal-Assistant-API
This is a simple RESTful API for managing appointments. It may obtain appointment data based on a certain date range, create, change, and delete appointments, and more. The API also provides basic natural language understanding to help with appointment creation and change user input.

## Getting started
To get started, clone the repository and install the dependencies:

```
git clone https://github.com/thesushilsharma/Personal-Assistant-API.git
cd appointment-api
npm install
```
Once you have installed the dependencies, start the server:
`npm start`

The server will start running on `http://localhost:3000.`

## API endpoints

### GET /appointments
This endpoint retrieves appointment information based on a provided date range. The start and end dates are provided as query parameters, like this:

`http://localhost:3000/appointments?startDate=2023-04-20&endDate=2023-04-30`

### POST /appointments
This endpoint creates a new appointment. The appointment information should be provided in the request body as a JSON object with a text property containing the appointment details in natural language. The API will use basic natural language processing to parse the appointment details and create a new appointment. For example:

```
{
  "text": "Create an appointment on April 27th at 2pm for a dentist checkup"
}
```
### PUT /appointments/:id
This endpoint updates an existing appointment. The appointment ID should be provided in the URL, like this:

`http://localhost:3000/appointments/1234`

The appointment information should be provided in the request body as a JSON object with a `text` property containing the updated appointment details in natural language. The API will use basic natural language processing to parse the updated appointment details and update the appointment. For example:

```
{
  "text": "Update appointment 1234 to May 4th at 10am for a haircut"
}
```
### DELETE /appointments/:id
This endpoint deletes an existing appointment. The appointment ID should be provided in the URL, like this:This endpoint deletes an existing appointment. The appointment ID should be provided in the URL, like this:
`http://localhost:3000/appointments/1234`

## Dependencies
This project uses the following dependencies:
- express
- body-parser
- nlp-js

## License
This project is licensed under the MIT License. See the [LICENSE](https://github.com/thesushilsharma/Personal-Assistant-API/blob/main/LICENSE) file for details.
