const express = require('express');
const router = express.Router();

// Mock implant center data
let implants = [
  { id: 1, name: 'Implant Center One', location: 'Downtown' },
  { id: 2, name: 'Smile Implants', location: 'Midtown' }
];

// GET /api/implants
router.get('/', (req, res) => {
  res.json(implants);
});

// POST /api/implants - add new implant center
router.post('/', (req, res) => {
  const newImplant = req.body;
  newImplant.id = implants.length ? implants[implants.length - 1].id + 1 : 1;
  implants.push(newImplant);
  res.status(201).json(newImplant);
});

// PATCH /api/implants/:id - update implant center
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const implant = implants.find(i => i.id === id);
  if (!implant) {
    return res.status(404).json({ error: 'Implant center not found' });
  }
  Object.assign(implant, req.body);
  res.json(implant);
});

// DELETE /api/implants/:id - delete implant center
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = implants.findIndex(i => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Implant center not found' });
  }
  const deleted = implants.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;
