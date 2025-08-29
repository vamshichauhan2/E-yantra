import express from 'express';
const router=express.Router();
import  Message from '../Schema/message.js'



router.post('/post/messages', async (req, res) => {
  try {
    const message = new Message(req.body);
    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
    req.io.emit('messageupadated', { type: 'updated', message:savedMessage });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET endpoint to retrieve all messages
router.get('/get/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.delete('/delete/:Id', async (req, res) => {
  const { Id } = req.params;
  try {
    const message = await Message.findByIdAndDelete(Id);
    if (message) {
      res.status(200).json({ msg: 'Successfully deleted' });
    } else {
      res.status(404).json({ errorMsg: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
});


export default router