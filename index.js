let SERVER_NAME = "patient-api";
let PORT = 10000;
// let HOST = "192.168.2.95";
let HOST = "127.0.0.1";
// let HOST = "10.24.32.80";

const { log } = require("console");
const { Int32 } = require("mongodb");
const mongoose = require("mongoose");
const username = "admin";
const password = "admin";
const dbname = "clinicalDataDB";

// Atlas MongoDb connection string format
//mongodb+srv://<username>:<password>@cluster0.k7qyrcg.mongodb.net/<dbname(optional)>?retryWrites=true&w=majority
let uristring =
  "mongodb+srv://" +
  username +
  ":" +
  password +
  "@cluster0.qzvfycm.mongodb.net/?retryWrites=true&w=majority";

// Makes db connection asynchronously
mongoose.connect(uristring, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  // we're connected!
  console.log("!!!! Connected to db: " + uristring);
});

//patient schema
const patientSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  address: String,
  date_of_birth: String,
  department: String,
  doctor: String,
  patient_id: String,
});

const patientTestSchema = new mongoose.Schema({
  patientId: String,
  date: String,
  nurse_name: String,
  type: String,
  category: String,
  diastolic: String,
  systolic: String,
  condition_critical: String,
});

// Compiles the schema into a model, opening (or creating, if
// nonexistent) the 'Patient' collection in the MongoDB database
let PatientsModel = mongoose.model("Patients", patientSchema);
let PatientTestModel = mongoose.model("PatientsTest", patientTestSchema);
// let TestModel = mongoose.model("PatientsTest", patientTestSchema);

let errors = require("restify-errors");
let restify = require("restify"),
  // Create the restify server
  server = restify.createServer({ name: SERVER_NAME });

server.listen(PORT, HOST, function () {
  console.log("Server %s listening at %s", server.name, server.url);
  console.log("**** Resources: ****");
  console.log("********************");
  console.log(" /patients");
  console.log(" /patients/:id");
});

server.use(restify.plugins.fullResponse());
server.use(restify.plugins.bodyParser());

// Get all patients in the system
server.get("/patients", function (req, res, next) {
  console.log("GET /patients params=>" + JSON.stringify(req.params));

  // Find every patients in db
  PatientsModel.find({})
    .then((patients) => {
      // Return all of the patients in the system
      res.send(patients);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

//find patient in db
server.get("/patients/:id", function (req, res, next) {
  console.log("GET /patients/ params=>" + JSON.stringify(req.params));

  // Find  patient in db
  PatientsModel.findOne({ _id: req.params.id })
    .then((patient) => {
      // Return patient in the system
      if (patient) {
        res.send(200, patient);
      } else {
        res.send(404, "Patient not found");
      }
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Create a new patient
server.post("/patients", function (req, res, next) {
  console.log("POST /patients params=>" + JSON.stringify(req.params));
  console.log("POST /patients body=>" + JSON.stringify(req.body));

  // validation of manadatory fields
  if (req.body.first_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("first name must be supplied"));
  }
  if (req.body.last_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("last name must be supplied"));
  }
  if (req.body.address === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("address must be supplied"));
  }
  if (req.body.date_of_birth === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("date of birth must be supplied"));
  }
  if (req.body.department === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("department must be supplied"));
  }
  if (req.body.doctor === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("doctor name must be supplied"));
  }
  if (req.body.patient_id === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("patient id must be supplied"));
  }

  let newPatient = new PatientsModel({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    address: req.body.address,
    date_of_birth: req.body.date_of_birth,
    department: req.body.department,
    doctor: req.body.doctor,
    patient_id: req.body.patient_id,
  });

  // Create the patient and save to db
  newPatient
    .save()
    .then((patient) => {
      console.log("saved Patient: " + patient);
      // Send the patient if no issues
      res.send(201, patient);
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Add test for a patient
server.post("/patients/:id/tests", function (req, res, next) {
  console.log("POST /patients params=>" + JSON.stringify(req.params));
  console.log("POST /patients body=>" + JSON.stringify(req.body));
  // console.log("diastolic:", req.readings.diastolic);
  // validation of manadatory fields

  if (req.body.category === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("address must be supplied"));
  }
  if (req.body.date === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("date of birth must be supplied"));
  }
  if (req.body.type === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("department must be supplied"));
  }
  if (req.body.nurse_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("nurse name must be supplied"));
  }
  if (req.body.patientId === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("patient id must be supplied"));
  }
  if (req.body.diastolic === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("diastolic must be supplied"));
  }
  if (req.body.systolic === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("systolic must be supplied"));
  }
  if (req.body.condition_critical === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(
      new errors.BadRequestError("condition critical must be supplied")
    );
  }

  let newPatientTest = new PatientTestModel({
    patientId: req.params.id,
    date: req.body.date,
    nurse_name: req.body.nurse_name,
    type: req.body.type,
    category: req.body.category,
    diastolic: req.body.diastolic,
    systolic: req.body.systolic,
    condition_critical: req.body.condition_critical,
  });

  // Create the patient test and save to db
  newPatientTest
    .save()
    .then((patient_test) => {
      console.log("saved Patient Test: " + patient_test);
      // Send the patient if no issues
      res.send(201, patient_test);
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// View tests of a patients
server.get("/patients/tests", function (req, res, next) {
  console.log("GET /patients/tests params=>" + JSON.stringify(req.params));

  // Find every patients in db
  PatientTestModel.find({})
    .then((patients_tests) => {
      // Return all of the patients in the system
      res.send(patients_tests);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// View tests of a patient
server.get("/patients/:id/tests", function (req, res, next) {
  console.log("GET /patients/tests params=>" + JSON.stringify(req.params));

  // Find every patients in db
  PatientTestModel.find({ patientId: req.params.id })
    .then((patients_tests) => {
      // Return all of the patients in the system
      res.send(patients_tests);
      return next();
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// update patient info by their id
server.put("/patients/:id", function (req, res, next) {
  console.log("Put /patients params=>" + JSON.stringify(req.params));
  console.log("Put /patients body=>" + JSON.stringify(req.body));
  // validation of manadatory fields
  if (req.body.first_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("first name must be supplied"));
  }
  if (req.body.last_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("last name must be supplied"));
  }
  if (req.body.address === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("address must be supplied"));
  }
  if (req.body.date_of_birth === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("date of birth must be supplied"));
  }
  if (req.body.department === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("department must be supplied"));
  }
  if (req.body.doctor === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("doctor name must be supplied"));
  }
  if (req.body.patient_id === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("patient id must be supplied"));
  }

  let newPatient = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    address: req.body.address,
    date_of_birth: req.body.date_of_birth,
    department: req.body.department,
    doctor: req.body.doctor,
    patient_id: req.params.id,
  };

  var patientId = new mongoose.Types.ObjectId(req.params.id);
  // Update the patient with the persistence engine
  PatientsModel.findByIdAndUpdate({ _id: patientId }, newPatient, {
    new: true,
  })
    .then((patient) => {
      if (patient) {
        res.send(200, patient);
      } else {
        res.send(404, "Patient not found");
      }
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// update patient test info
server.put("/patients/tests/:id", function (req, res, next) {
  console.log("Put /patients/tests params=>" + JSON.stringify(req.params));
  console.log("Put /patients/tests body=>" + JSON.stringify(req.body));

  // validation of manadatory fields
  if (req.body.first_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("first name must be supplied"));
  }
  if (req.body.last_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("last name must be supplied"));
  }
  if (req.body.category === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("address must be supplied"));
  }
  if (req.body.date === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("date of birth must be supplied"));
  }
  if (req.body.type === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("department must be supplied"));
  }
  if (req.body.nurse_name === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("nurse name must be supplied"));
  }
  if (req.body.patientId === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("patient id must be supplied"));
  }
  if (req.body.readings.diastolic === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("diastolic must be supplied"));
  }
  if (req.body.readings.systolic === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(new errors.BadRequestError("systolic must be supplied"));
  }
  if (req.body.readings.condition_critical === undefined) {
    // If there are any errors, pass them to next in the correct format
    return next(
      new errors.BadRequestError("condition critical must be supplied")
    );
  }

  let newPatientTest = {
    patientId: req.params.id,
    date: req.body.date,
    nurse_name: req.body.nurse_name,
    type: req.body.type,
    category: req.body.category,
    diastolic: req.body.diastolic,
    systolic: req.body.systolic,
    condition_critical: req.body.condition_critical,
  };

  // Update the patient test with the persistence engine
  TestModel.findByIdAndUpdate({ _id: req.params.id }, newPatientTest, {
    new: true,
  })
    .then((patient_test) => {
      if (patient_test) {
        res.send(200, patient_test);
      } else {
        res.send(404, "Patient test not found");
      }
    })
    .catch((error) => {
      return next(new Error(JSON.stringify(error.errors)));
    });
});

// Delete patient with the given id
server.del("/patients/:id", function (req, res, next) {
  console.log("POST /patients params=>" + JSON.stringify(req.params));
  // Delete the patient in db
  var patientId = new mongoose.Types.ObjectId(req.params.id);
  PatientsModel.findOneAndDelete({ _id: patientId })
    .then((deletedPatient) => {
      console.log("deleted patient: " + deletedPatient);
      if (deletedPatient) {
        res.send(200, "Patient deleted successfully");
      } else {
        res.send(404, "Patient not found");
      }
      return next();
    })
    .catch((error) => {
      console.log("error: " + error);
      return next(new Error(JSON.stringify(error.errors)));
    });
});
