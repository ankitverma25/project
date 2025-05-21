import Part from '../models/part.model.js';
import cloudinary from '../src/cloudinary.js';

// Create a new part listing
export const createPart = async (req, res) => {
  try {
    const { partName, carModel, description, condition, price, isNegotiable, contactNumber } = req.body;
    const owner = req.user._id;

    // Upload images to cloudinary if they exist
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'car-parts',
        });
        imageUrls.push(result.secure_url);
      }
    }

    const part = new Part({
      owner,
      partName,
      carModel,
      description,
      condition,
      price,
      isNegotiable,
      contactNumber,
      images: imageUrls,
    });

    await part.save();
    res.status(201).json(part);
  } catch (error) {
    console.error('Error creating part:', error);
    res.status(500).json({ message: 'Error creating part listing', error: error.message });
  }
};

// Get all parts with optional filtering
export const getAllParts = async (req, res) => {
  try {
    const { condition, minPrice, maxPrice, status } = req.query;
    const query = {};

    if (condition) query.condition = condition;
    if (status) query.status = status;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const parts = await Part.find(query)
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });

    // Add isOwner field to each part
    const partsWithOwnership = parts.map(part => {
      const partObj = part.toObject();
      partObj.isOwner = req.user && part.owner._id.toString() === req.user._id.toString();
      return partObj;
    });

    res.json(partsWithOwnership);
  } catch (error) {
    console.error('Error fetching parts:', error);
    res.status(500).json({ message: 'Error fetching parts', error: error.message });
  }
};

// Get a specific part by ID
export const getPartById = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id).populate('owner', 'name avatar');
    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    const partObj = part.toObject();
    partObj.isOwner = req.user && part.owner._id.toString() === req.user._id.toString();
    res.json(partObj);
  } catch (error) {
    console.error('Error fetching part:', error);
    res.status(500).json({ message: 'Error fetching part', error: error.message });
  }
};

// Update a part
export const updatePart = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    // Check ownership
    if (part.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this part' });
    }

    const updateData = { ...req.body };
    
    // Handle image uploads if any
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'car-parts',
        });
        imageUrls.push(result.secure_url);
      }
      updateData.images = imageUrls;
    }

    const updatedPart = await Part.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('owner', 'name avatar');

    res.json(updatedPart);
  } catch (error) {
    console.error('Error updating part:', error);
    res.status(500).json({ message: 'Error updating part', error: error.message });
  }
};

// Delete a part
export const deletePart = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    // Check ownership
    if (part.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this part' });
    }

    await Part.findByIdAndDelete(req.params.id);
    res.json({ message: 'Part deleted successfully' });
  } catch (error) {
    console.error('Error deleting part:', error);
    res.status(500).json({ message: 'Error deleting part', error: error.message });
  }
};

// Mark part as sold
export const markAsSold = async (req, res) => {
  try {
    const part = await Part.findById(req.params.id);
    if (!part) {
      return res.status(404).json({ message: 'Part not found' });
    }

    // Check ownership
    if (part.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this part' });
    }

    part.status = 'sold';
    await part.save();
    res.json(part);
  } catch (error) {
    console.error('Error marking part as sold:', error);
    res.status(500).json({ message: 'Error updating part status', error: error.message });
  }
};

// Get parts for the logged-in user
export const getMyParts = async (req, res) => {
  try {
    const parts = await Part.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.json(parts.map(part => ({
      ...part.toObject(),
      isOwner: true
    })));
  } catch (error) {
    console.error('Error fetching my parts:', error);
    res.status(500).json({ message: 'Error fetching parts', error: error.message });
  }
};

// Search parts with advanced filtering
export const searchParts = async (req, res) => {
  try {
    const { 
      query, 
      condition, 
      minPrice, 
      maxPrice, 
      status 
    } = req.query;

    const searchQuery = {};

    // Text search across multiple fields
    if (query) {
      searchQuery.$or = [
        { partName: { $regex: query, $options: 'i' } },
        { carModel: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Apply filters
    if (condition) searchQuery.condition = condition;
    if (status) searchQuery.status = status;
    if (minPrice || maxPrice) {
      searchQuery.price = {};
      if (minPrice) searchQuery.price.$gte = Number(minPrice);
      if (maxPrice) searchQuery.price.$lte = Number(maxPrice);
    }

    const parts = await Part.find(searchQuery)
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });

    // Add isOwner field to each part
    const partsWithOwnership = parts.map(part => {
      const partObj = part.toObject();
      partObj.isOwner = req.user && part.owner._id.toString() === req.user._id.toString();
      return partObj;
    });

    res.json(partsWithOwnership);
  } catch (error) {
    console.error('Error searching parts:', error);
    res.status(500).json({ message: 'Error searching parts', error: error.message });
  }
};