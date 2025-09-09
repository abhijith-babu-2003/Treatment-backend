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

router.post('/', createTreatment);


router.delete('/:id', deleteTreatment);

export default router;