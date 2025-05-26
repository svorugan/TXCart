const express = require('express');
const router = express.Router();

// Mock diagnostic center data
let diagnostics = [
  { id: 1, name: 'Central Diagnostics', location: 'Downtown' },
  { id: 2, name: 'QuickTest Labs', location: 'Uptown' }
];

// GET /api/diagnostics
router.get('/', (req, res) => {
  res.json(diagnostics);
});

// POST /api/diagnostics - add new diagnostic center
router.post('/', (req, res) => {
  const newDiagnostic = req.body;
  newDiagnostic.id = diagnostics.length ? diagnostics[diagnostics.length - 1].id + 1 : 1;
  diagnostics.push(newDiagnostic);
  res.status(201).json(newDiagnostic);
});

// PATCH /api/diagnostics/:id - update diagnostic center
router.patch('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const diagnostic = diagnostics.find(d => d.id === id);
  if (!diagnostic) {
    return res.status(404).json({ error: 'Diagnostic center not found' });
  }
  Object.assign(diagnostic, req.body);
  res.json(diagnostic);
});

// DELETE /api/diagnostics/:id - delete diagnostic center
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = diagnostics.findIndex(d => d.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Diagnostic center not found' });
  }
  const deleted = diagnostics.splice(index, 1);
  res.json(deleted[0]);
});

module.exports = router;
