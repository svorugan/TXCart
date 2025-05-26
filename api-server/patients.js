const express = require('express');
const router = express.Router();

// Mock patient data
let patients = [
  { id: 1, name: 'Amit Verma', preferredDoctorId: 1, preferredHospitalId: 1, field: 'Orthopedics' },
  { id: 2, name: 'Sunita Rao', preferredDoctorId: 2, preferredHospitalId: 2, field: 'Cardiology' },
  { id: 3, name: 'Rahul Sharma', preferredDoctorId: 1, preferredHospitalId: 1, field: 'Orthopedics' },
  { id: 4, name: 'Priya Nair', preferredDoctorId: 3, preferredHospitalId: 1, field: 'Pediatrics' },
  { id: 5, name: 'Vikram Singh', preferredDoctorId: 2, preferredHospitalId: 2, field: 'Neurology' }
];

// GET /api/patients
router.get('/', (req, res) => {
  res.json(patients);
});

// POST /api/patients - add new patient
router.post('/', (req, res) => {
  const newPatient = req.body;
  newPatient.id = patients.length ? patients[patients.length - 1].id + 1 : 1;
  patients.push(newPatient);
  res.status(201).json(newPatient);
});

// PATCH /api/patients/:id - update patient
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const patient = patients.find(p => p.id === id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  Object.assign(patient, req.body);
  res.json(patient);
});

// DELETE /api/patients/:id - delete patient
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = patients.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  const deleted = patients.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;
