# Personal-Assistant-API

This is a simple RESTful API for managing appointments. It may obtain appointment data based on a certain date range, create, change, and delete appointments, and more. The API also provides basic natural language understanding to help with appointment creation and change user input.

## Getting started

To get started, clone the repository and install the dependencies:

```bash
  git clone https://github.com/thesushilsharma/Personal-Assistant-API.git
  cd Personal-Assistant-API
  npm install
```

Once you have installed the dependencies, start the server:
`npm start`

The server will start running on `http://localhost:3000.`

## API endpoints

### GET /appointments (Viewing all Appointments)

This endpoint retrieves appointment information based on a provided ID.

`http://localhost:3000/booking`

### POST /appointments (Creating an Appointment)

This endpoint creates a new appointment. The appointment information should be provided in the request body as a JSON object with a text property containing the appointment details in natural language. The API will use basic natural language processing to parse the appointment details and create a new appointment. For example:

`
{
    "title": "Dentist Appointment",
    "description": "Checkup and cleaning",
    "start": "next Wednesday at 2pm",
    "end": "next Wednesday at 3pm"
}
`

`http://localhost:3000/appointments`

### PUT /appointments/:id (Editing an Appointment)

This endpoint updates an existing appointment. The appointment ID should be provided in the URL, like this:

`http://localhost:3000/appointments/644b90f055a26a3fbc7ad832/edit`

The appointment information should be provided in the request body as a JSON object with a `text` property containing the updated appointment details in natural language. The API will use basic natural language processing to parse the updated appointment details and update the appointment. For example:

`
{
  "title": "Meeting with Jane",
  "description": "Discuss new project proposal",
  "start": "tomorrow at 2pm",
  "end": "tomorrow at 3pm"
}
`

### DELETE /appointments/:id/delete (Deleting an Appointment)

This endpoint deletes an existing appointment. The appointment ID should be provided in the URL, like this:This endpoint deletes an existing appointment. The appointment ID should be provided in the URL, like this:
`http://localhost:3000/appointments/644aefa0a27c110ea49a1fd7/delete`

### DELETE /search (Searching for an Appointment)

To search for an existing appointment, click the "Search" button on the home page. Enter the appointment ID and click "Search" to search for the appointment. If the appointment is found, you will be redirected to the appointment's details page. The appointment ID should be provided in the URL, like this:
`http://localhost:3000/search`

## Dependencies

This project uses the following dependencies:

- Express
- Body-parser
- MongoDB
- Chrono-node

## Database

Railway.app (Mongodb Database)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
