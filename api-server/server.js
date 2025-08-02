const express = require('express');
const cors = require('cors');
const doctors = require('./doctors');
const implants = require('./implants');
const hospitals = require('./hospitals');
const diagnostics = require('./diagnostics');
const patients = require('./patients');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from assets directory
app.use('/assets', express.static('assets'));

// API Routes
app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

app.get('/api/implants', (req, res) => {
  res.json(implants);
});

app.get('/api/hospitals', (req, res) => {
  res.json(hospitals);
});

app.get('/api/diagnostics', (req, res) => {
  res.json(diagnostics);
});

app.get('/api/patients', (req, res) => {
  res.json(patients);
});

// Start server
app.listen(port, () => {
  console.log(`Mock API server running on http://localhost:${port}`);
});
