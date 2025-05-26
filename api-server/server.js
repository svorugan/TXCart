const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const doctorsRouter = require('./doctors');
const hospitalsRouter = require('./hospitals');
const diagnosticsRouter = require('./diagnostics');
const implantsRouter = require('./implants');
const patientsRouter = require('./patients');

app.use('/api/doctors', doctorsRouter);
app.use('/api/hospitals', hospitalsRouter);
app.use('/api/diagnostics', diagnosticsRouter);
app.use('/api/implants', implantsRouter);
app.use('/api/patients', patientsRouter);

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});
