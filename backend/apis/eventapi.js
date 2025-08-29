import express from 'express';
const router = express.Router();
import Event from '../Schema/event.js';

// UPDATE event by Id
router.post('/update/post/:Id', async (req, res) => {
  try {
    const { Id } = req.params;
    const updateData = req.body; // Assuming req.body contains fields to update like title, description, etc.

    let event = await Event.findById(Id);

    if (event) {
      // Update event fields with provided data
      Object.assign(event, updateData);
      event = await event.save();
    } else {
      // Event not found, optionally create new or return error; here returning error
      return res.status(404).json({ errorMsg: 'Event not found' });
    }

    req.io.emit('event-changed', { type: 'updated', event });
    res.status(200).json({ message: 'Successfully updated', event });
  } catch (err) {
    //console.error(err);
    res.status(500).json({ errorMsg: 'Internal Server Error Please Try Again Later' });
  }
});

// CREATE new event
router.post('/event/post', async (req, res) => {
  try {
    const eventData = req.body; 

    const event = await new Event({
      ...eventData,
      createDate: Date.now()
    }).save();

    req.io.emit('event-changed', { type: 'created', event });
    res.status(200).json({ message: 'Successfully created', event });
  } catch (err) {
    //console.error(err);
    res.status(500).json({ errorMsg: 'Internal Server Error Please Try Again Later' });
  }
});

// GET ALL events
router.get('/get', async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (err) {
    //console.log(err)
    res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
});

// DELETE event BY ID
router.delete('/event/delete/:Id', async (req, res) => {
  const { Id } = req.params;
  try {
    const event = await Event.findByIdAndDelete(Id);
    if (event) {
      req.io.emit('event-changed', { type: 'deleted', event });
      res.status(200).json({ msg: 'Successfully deleted' });
    } else {
      res.status(404).json({ errorMsg: 'Not Found' });
    }
  } catch (err) {
    res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
});


export default router;



