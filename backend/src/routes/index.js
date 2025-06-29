const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const EmployeeController = require('../controllers/EmployeeController');
const PointController = require('../controllers/PointController');

router.get('/employees', EmployeeController.index);
router.get('/employees/:id', EmployeeController.show);
router.post('/employees', upload.single('photo'), EmployeeController.store);
router.put('/employees/:id', upload.single('photo'), EmployeeController.update);
router.delete('/employees/:id', EmployeeController.destroy);

router.post('/points', PointController.store);
router.put('/points/:id', PointController.update);
router.delete('/points/:id', PointController.destroy);

module.exports = router;
