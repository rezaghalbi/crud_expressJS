const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const db = require("./connection");
const response = require("./response");
const { error } = require("console");
const cors = require("cors");

app.use(bodyParser.json());
app.use(cors());

// show all data
app.get("/", (req, res) => {
  const sql = "SELECT * FROM penduduk";
  db.query(sql, (error, result) => {
    response(200, result, "get all data", res);
  });
});

// search from nik
app.get("/search", (req, res) => {
  const nik = req.query.nik;
  const sql = `SELECT * FROM penduduk WHERE nik = ${nik}`;
  db.query(sql, (error, result) => {
    if (error) {
      response(400, error, "error", res);
    } else {
      response(200, result, "get data by nik", res);
    }
  });
});

// data input route
app.post("/inputData", async (req, res) => {
  try {
    const { nik, nama_lengkap, alamat, pekerjaan } = req.body;

    // Validate the request body
    if (!nik || !nama_lengkap || !alamat || !pekerjaan) {
      return res.status(400).json({ message: "Bad Request" });
    }

    // Input the data into the database
    const result = await db.query(
      `INSERT INTO penduduk (nik, nama_lengkap, alamat, pekerjaan) VALUES (?,?,?,?)`,
      [nik, nama_lengkap, alamat, pekerjaan]
    );

    res.json({ message: "Data inputted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// route update data
app.patch("/updateData/:nik", async (req, res) => {
  try {
    const nik = req.params.nik;
    const { nama_lengkap, alamat, pekerjaan } = req.body;

    // Validate the request body
    if (!nama_lengkap || !alamat || !pekerjaan) {
      return res.status(400).json({ message: "Bad Request" });
    }

    // Update the data in the database
    const sql = `UPDATE penduduk SET nama_lengkap =?, alamat =?, pekerjaan =? WHERE nik =?`;
    const result = await db.query(sql, [nama_lengkap, alamat, pekerjaan, nik]);

    res.json({ message: "Data updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// delete data
app.delete("/deleteData/:nik", async (req, res) => {
  try {
    const nik = req.params.nik;

    // Delete the data from the database
    const sql = `DELETE FROM penduduk WHERE nik =?`;
    const result = await db.query(sql, [nik]);

    res.json({ message: "Data deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
