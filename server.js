const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const chrono = require("chrono-node");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongo_url =
  "mongodb://mongo:N0OsbufKiL3q76mzN6jj@containers-us-west-58.railway.app:6225/test?authSource=admin";

mongoose.connect(mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

const appointmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

// Create an appointment
app.post("/appointments", (req, res) => {
  const { title, description, start, end } = req.body;

  // Parse the start and end date/time strings using chrono-node
  const startDate = chrono.parseDate(start);
  const endDate = chrono.parseDate(end);

  console.log(`start: ${startDate}`);
  console.log(`end: ${endDate}`);

  const appointment = new Appointment({
    title,
    description,
    start: startDate,
    end: endDate,
  });

  appointment.save((err, appointment) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    return res.status(201).json(appointment);
  });
});

// Get appointments within a date range
app.get("/appointments", (req, res) => {
  const { start, end } = req.query;

  // Parse the start and end dates
  const startDate = chrono.parseDate(start);
  const endDate = chrono.parseDate(end);

  const appointments = Appointment.find({
    start: { $gte: startDate },
    end: { $lte: endDate },
  });

  appointments.exec((err, appointments) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    return res.json(appointments);
  });
});

// Get all appointments
app.get("/appointments/all", (req, res) => {
    Appointment.find({}, (err, appointments) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      return res.json(appointments);
    });
  });

// Update an appointment
app.put("/appointments/:id", (req, res) => {
    const { id } = req.params;
    const { title, description, start, end } = req.body;
  
    Appointment.findOneAndUpdate(
      { _id: id },
      { title, description, start: chrono.parseDate(start), end: chrono.parseDate(end) },
      { new: true, useFindAndModify: false },
      (err, appointment) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }
  
        return res.json(appointment);
      }
    );
  });
  

// Delete an appointment
app.delete("/appointments/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the appointment by ID and delete it
      const deletedAppointment = await Appointment.findByIdAndDelete(id);
  
      // If the appointment was not found, return an error
      if (!deletedAppointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
  
      // Return a success message 
      //return res.sendStatus(204);
      return res.json({ message: "Appointment deleted" });
    } catch (err) {
      // If there was an error, return an error response
      return res.status(400).json({ error: err.message });
    }
  });
 

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

// Homepage
app.get("/", (req, res) => {
  const apiInfo = {
    name: "Appointment API",
    version: "1.0.0",
    description: "RESTful API for managing appointments",
  };
  res.json(apiInfo);
});
