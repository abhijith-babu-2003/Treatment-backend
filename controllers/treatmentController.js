import Treatment from "../model/treatmentSchema.js";

// @desc    Get user treatments
// @route   GET /api/treatments
// @access  Private
export const getTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find({ user: req.user.id });
    res.status(200).json(treatments);
  } catch (error) {
    console.error('Get treatments error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new treatment
// @route   POST /api/treatments
// @access  Private
export const createTreatment = async (req, res) => {
  try {
    const { name, dosage, frequency, startDate, endDate, notes, description } = req.body;
    
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

    res.status(201).json(treatment);
  } catch (error) {
    console.error('Create treatment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update treatment
// @route   PUT /api/treatments/:id
// @access  Private
export const updateTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      return res.status(404).json({ message: 'Treatment not found' });
    }

    // Check if user owns the treatment
    if (treatment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedTreatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTreatment);
  } catch (error) {
    console.error('Update treatment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete treatment
// @route   DELETE /api/treatments/:id
// @access  Private
export const deleteTreatment = async (req, res) => {
  try {
    // Validate ID format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid treatment ID format' });
    }

    const treatment = await Treatment.findById(req.params.id);

    if (!treatment) {
      return res.status(404).json({ message: 'Treatment not found' });
    }

    // Check if user owns the treatment
    if (treatment.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this treatment' 
      });
    }

    // Delete the treatment
    const deletedTreatment = await Treatment.findByIdAndDelete(req.params.id);
    
    if (!deletedTreatment) {
      return res.status(404).json({ message: 'Treatment not found or already deleted' });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Treatment deleted successfully',
      id: req.params.id 
    });
  } catch (error) {
    console.error('Delete treatment error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid treatment ID' });
    }
    res.status(500).json({ message: error.message });
  }
};