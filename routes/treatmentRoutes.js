import express from 'express';
import { 
  getTreatments, 
  createTreatment,  
  deleteTreatment 
} from '../controllers/treatmentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();


router.use(protect);

router.get('/', getTreatments);

// POST /api/treatments - Create a new treatment
router.post('/', createTreatment);

// DELETE /api/treatments/:id - Delete a treatment
router.delete('/:id', deleteTreatment);

export default router;