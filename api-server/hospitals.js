const express = require('express');
const router = express.Router();

// Mock hospital data
let hospitals = [
  { id: 1, name: 'City Hospital', location: 'Downtown' },
  { id: 2, name: 'Green Valley Hospital', location: 'Suburbs' }
];

// GET /api/hospitals
router.get('/', (req, res) => {
  res.json(hospitals);
});

// POST /api/hospitals - add new hospital
router.post('/', (req, res) => {
  const newHospital = req.body;
  newHospital.id = hospitals.length ? hospitals[hospitals.length - 1].id + 1 : 1;
  hospitals.push(newHospital);
  res.status(201).json(newHospital);
});

// PATCH /api/hospitals/:id - update hospital
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const hospital = hospitals.find(h => h.id === id);
  if (!hospital) {
    return res.status(404).json({ error: 'Hospital not found' });
  }
  Object.assign(hospital, req.body);
  res.json(hospital);
});

// DELETE /api/hospitals/:id - delete hospital
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = hospitals.findIndex(h => h.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Hospital not found' });
  }
  const deleted = hospitals.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;
