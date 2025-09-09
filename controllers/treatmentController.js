import Treatment from "../model/treatmentSchema.js";


export const getTreatments = async (req, res) => {
  try {
    if (!req.user?.id) {
      console.error('No user ID in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const treatments = await Treatment.find({ user: req.user.id })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .lean();
      
    console.log(`Found ${treatments.length} treatments for user ${req.user.id}`);
    res.status(200).json(treatments);
  } catch (error) {
    console.error('Get treatments error:', error);
    res.status(500).json({ 
      message: error.message || 'Error fetching treatments' 
    });
  }
};


export const createTreatment = async (req, res) => {
  try {
    console.log('Create treatment request:', { body: req.body, user: req.user });
    
    const { name, dosage, frequency, startDate, endDate, notes, description } = req.body;
    
    if (!req.user?.id) {
      console.error('No user ID in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const treatment = await Treatment.create({
      user: req.user.id,
      name,
      dosage: dosage || 'N/A',
      frequency: frequency || 'As needed',
      startDate: startDate || new Date(),
      endDate: endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      notes: notes || '',
      description: description || '',
    });

    console.log('Created treatment:', treatment);
    res.status(201).json(treatment);
  } catch (error) {
    console.error('Create treatment error:', error);
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({ 
      message: error.message || 'Error creating treatment' 
    });
  }
};


export const deleteTreatment = async (req, res) => {
  try {
    console.log('Delete treatment request:', { params: req.params, user: req.user });
    
    const treatment = await Treatment.findById(req.params.id);
    console.log('Found treatment:', treatment);

    if (!treatment) {
      console.log('Treatment not found');
      return res.status(404).json({ message: 'Treatment not found' });
    }

    // Check if user owns the treatment
    if (!treatment.user) {
      console.error('Treatment has no user field:', treatment);
      return res.status(500).json({ message: 'Invalid treatment data' });
    }

    if (treatment.user.toString() !== req.user?.id) {
      console.log('Unauthorized access attempt:', { 
        treatmentUser: treatment.user.toString(), 
        currentUser: req.user?.id 
      });
      return res.status(403).json({ message: 'Not authorized to delete this treatment' });
    }

    // Delete the treatment
    const result = await Treatment.findByIdAndDelete(req.params.id);
    console.log('Delete result:', result);
    
    if (!result) {
      console.log('Treatment already deleted');
      return res.status(404).json({ message: 'Treatment not found' });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Treatment deleted successfully',
      id: req.params.id 
    });
  } catch (error) {
    console.error('Delete treatment error:', error);
    const statusCode = error.name === 'CastError' ? 400 : 500;
    res.status(statusCode).json({ 
      message: error.message || 'Error deleting treatment' 
    });
  }
};