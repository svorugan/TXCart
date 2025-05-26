const express = require('express');
const router = express.Router();

// Mock doctor data
let doctors = [
  {
    id: 1,
    name: 'Dr. Anil Kumar',
    specialty: 'Cardiology',
    serving_locations: [
      { locality: 'Kothapet', city: 'Hyderabad' },
      { city: 'Hyderabad' }
    ]
  },
  {
    id: 2,
    name: 'Dr. Priya Sharma',
    specialty: 'Neurology',
    serving_locations: [ { city: 'Hyderabad' } ]
  },
  {
    id: 3,
    name: 'Dr. Ramesh Gupta',
    specialty: 'Pediatrics',
    serving_locations: [ { locality: 'Nagole', city: 'Hyderabad' } ]
  },
  {
    id: 4,
    name: 'Dr. Sneha Patel',
    specialty: 'Dermatology',
    serving_locations: [ { locality: 'Andheri', city: 'Mumbai' }, { city: 'Mumbai' } ]
  },
  {
    id: 5,
    name: 'Dr. Arjun Singh',
    specialty: 'Orthopedics',
    serving_locations: [ { city: 'Bengaluru' } ]
  }
];

// GET /api/doctors
// Supports filtering by locality and city via query params
router.get('/', (req, res) => {
  const { locality, city } = req.query;
  if (!city) {
    return res.json(doctors);
  }
  // Only filter if city is provided
  const matchesLocation = (doctor) => {
    return doctor.serving_locations && doctor.serving_locations.some(loc => {
      // Doctor serves whole city
      if (loc.city === city && (!loc.locality || loc.locality === '' || !locality)) {
        return true;
      }
      // Doctor serves specific locality in city
      if (loc.city === city && loc.locality && locality && loc.locality.toLowerCase() === locality.toLowerCase()) {
        return true;
      }
      return false;
    });
  };
  const filtered = doctors.filter(matchesLocation);
  res.json(filtered);
});

// POST /api/doctors - add new doctor
router.post('/', (req, res) => {
  const { name, specialty, serving_locations } = req.body;
  if (!name || !specialty || !Array.isArray(serving_locations)) {
    return res.status(400).json({ error: 'name, specialty, and serving_locations (array) are required' });
  }
  const newDoctor = {
    id: doctors.length ? doctors[doctors.length - 1].id + 1 : 1,
    name,
    specialty,
    serving_locations
  };
  doctors.push(newDoctor);
  res.status(201).json(newDoctor);
});

// PATCH /api/doctors/:id - update doctor
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const doctor = doctors.find(d => d.id === id);
  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found' });
  }
  const { name, specialty, serving_locations } = req.body;
  if (name !== undefined) doctor.name = name;
  if (specialty !== undefined) doctor.specialty = specialty;
  if (serving_locations !== undefined) doctor.serving_locations = serving_locations;
  res.json(doctor);
});

// DELETE /api/doctors/:id - delete doctor
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = doctors.findIndex(d => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Doctor not found' });
  }
  const deleted = doctors.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;
