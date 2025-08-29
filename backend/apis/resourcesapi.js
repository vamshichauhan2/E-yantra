import express from 'express';
const router = express.Router();
import Resource from '../Schema/resources.js';

router.post('/share/resource', async (req, res) => {
  try {
    const { title, description, dateShared, resourceType, link, file } = req.body;

    const newResource = new Resource({
      title,
      description,
      sharedOn: dateShared,
      resourcetype: resourceType,
      link,
      videoUrl: file, 
    });

    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
   
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.delete('/delete/shared/resource/:Id', async (req, res) => {
  try {
    const { Id } = req.params;
    const deletedResource = await Resource.findByIdAndDelete(Id);
   

    if (!deletedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get('/Get/Resources', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.put('/update/Resource/:Id', async (req, res) => {
  try {
    const { Id } = req.params;
    const updateData = req.body;

    const updatedResource = await Resource.findByIdAndUpdate(Id, updateData, {
      new: true, 
      runValidators: true 
    });

    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.status(200).json(updatedResource);
  } catch (error) {
    
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

export default router;
