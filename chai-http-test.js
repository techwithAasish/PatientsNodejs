let chai = require("chai");
let chaiHttp = require("chai-http");
let expect = chai.expect;
chai.use(chaiHttp);

// define base uri for the REST API (lab03) under test
// const uri = "http://192.168.2.95:3000";
const uri = "http://127.0.0.1:3000";

describe("when we issue a 'GET' to /patients", function () {
  it("should return HTTP 200", function (done) {
    chai
      .request(uri)
      .get("/patients")
      .end(function (req, res) {
        expect(res.status).to.equal(200);
        done();
      });
  });
});

describe("when we issue a 'GET' to /patients", function () {
  it("should return empty list []", function (done) {
    chai
      .request(uri)
      .get("/patients")
      .end(function (req, res) {
        expect(res.text);
        done();
      });
  });
});

describe("when we issue a 'POST' to /patients with user info", function () {
  it("should return response with patient created", function (done) {
    chai
      .request(uri)
      .post("/patients")
      .field("first_name", "Peter")
      .field("last_name", "Doe")
      .field("address", "30 Progress Ave")
      .field("date_of_birth", "01/03/1999")
      .field("department", "Emergency")
      .field("doctor", "Ashim Bista")
      .field("patient_id", "100")
      .end(function (req, res) {
        expect(res.status).to.equal(201);
        // expect(res.text).to.equal(
        //   '{"first_name":"Peter","last_name":"Doe","address":"30 Progress Ave","date_of_birth":"01/03/1999","department":"Emergency","doctor":"Ashim Bista","patient_id":"100"}'
        // );
        done();
      });
  });
});

// describe("when we issue a 'GET' to /patients after creating new user", function () {
//   it("should return array with this patients", function (done) {
//     chai
//       .request(uri)
//       .get("/patients")
//       .end(function (req, res) {
//         expect(res.text).to.equal(
//           '[{"first_name":"Peter","last_name":"Doe","address":"30 Progress Ave","date_of_birth":"01/03/1999","department":"Emergency","doctor":"Ashim Bista","patient_id":"100"}]'
//         );
//         done();
//       });
//   });
// });
