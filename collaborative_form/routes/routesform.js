const express = require('express');
const {
  renderCreateForm,
  createForm,
  renderForm
} = require('../controllers/controllerform');

const router = express.Router();

// Route to render the form creation page
router.get('/admin/create', renderCreateForm);

// Route to handle form creation (POST from frontend or Postman)
router.post('/admin/create', createForm);

// Route to render the collaborative form by ID
router.get('/form/:id', renderForm);

module.exports = router;
