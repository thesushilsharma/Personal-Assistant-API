const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const chrono = require("chrono-node");
const path = require("path");
const cors = require("cors");
var cookieParser = require("cookie-parser");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const mongo_url =
  "mongodb://mongo:N0OsbufKiL3q76mzN6jj@containers-us-west-58.railway.app:6225/test?authSource=admin";

mongoose.connect(mongo_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);

const appointmentSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  title: { type: String, required: true },
  description: String,
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

app.get("/appointments", (req, res) => res.render("appointments"));
// Handle form submission to create a new appointment
app.post("/appointments", async (req, res) => {
  const { title, description, start, end } = req.body;

  try {
    // Create a new appointment with the form data
    const appointment = new Appointment({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      start: chrono.parseDate(start),
      end: chrono.parseDate(end),
    });

    // Save the appointment to the database
    await appointment.save();

    // Redirect the user to the appointments page
    res.redirect("/appointments");
  } catch (err) {
    // If there was an error, render the appointments form again with an error message
    res.render("appointments", { error: err.message });
  }
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

    // Log the IDs of all the appointments
    console.log(appointments.map((appointment) => appointment._id));
    // Pass the appointments variable to the EJS template
    res.render("all", { appointments });
  });
});

// Search for an appointment
app
  .route("/search")
  .get((req, res) => {
    res.render("search");
  })
  .post((req, res) => {
    const { id } = req.body;

    Appointment.findById(id, (err, appointment) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }

      res.redirect(`/appointments/${id}/edit`);
    });
  });

// Update or edit an appointment
app
  .route("/appointments/:id/edit")
  .all((req, res) => {
    const { id } = req.params;
    console.log("0");
    Appointment.findById(id, (err, appointment) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      res.render("update", { appointment });
    });
  })
  .put((req, res) => {
    const { id } = req.params;
    const { title, description, start, end } = req.body;
    console.log("1");
    Appointment.findById(id, (err, appointment) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      console.log("2");
      appointment.title = title;
      appointment.description = description;
      appointment.start = chrono.parseDate(start);
      appointment.end = chrono.parseDate(end);
      console.log("3");
      appointment.save((err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        res.redirect("/");
      });
    });
  });

// Delete an appointment
app
  .route("/appointments/:id/delete")
  // Render the delete view for an appointment
  .get(async (req, res) => {
    const { id } = req.params;

    try {
      // Find the appointment by ID
      console.log("Finding appointment with ID:", id);
      const appointment = await Appointment.findById(id);

      // If the appointment was not found, return an error
      if (!appointment) {
        console.log("Appointment not found for ID:", id);
        return res.status(404).json({ error: "Appointment not found" });
      }

      // Render the delete view and pass the appointment data to it
      console.log("Rendering delete view for appointment:", appointment);
      return res.render("delete", { appointment });
    } catch (err) {
      // If there was an error, return an error response
      console.error("Error finding appointment:", err);
      return res.status(400).json({ error: err.message });
    }
  })
  // Delete an appointment
  .delete(async (req, res) => {
    const { id } = req.params;

    try {
      // Find the appointment by ID and delete it
      console.log("Deleting appointment with ID:", id);
      const deletedAppointment = await Appointment.findByIdAndDelete(id);

      // If the appointment was not found, return an error
      if (!deletedAppointment) {
        console.log("Appointment not found for ID:", id);
        return res.status(404).json({ error: "Appointment not found" });
      }

      // Return a success message
      console.log("Appointment deleted:", deletedAppointment);
      return res.json({ message: "Appointment deleted" });
    } catch (err) {
      // If there was an error, return an error response
      console.error("Error deleting appointment:", err);
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
