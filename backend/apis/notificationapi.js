import express from 'express';
const router = express.Router();
import Notifications from "../Schema/notifications.js";


router.post('/notification/update/post/:Id', async (req, res) => {
  try {
    const { description, link } = req.body;
    const { Id } = req.params;
    let noti = await Notifications.findById(Id);
    let doc;

    if (noti) {
      noti.description = description;
      noti.link = link;
      noti.postedAt = Date.now();
      doc = await noti.save();
    } else {
      doc = await new Notifications({
        description,
        link,
        postedAt: Date.now(),
      }).save();
    }

    req.io.emit('notification-changed', { type: 'updated', notification: doc });
    res.status(200).json({ message: 'successFully updated' });
  } catch (err) {
    res.status(500).json({ errorMsg: 'Internal Server Error Please Try Again Later' });
  }
});


router.post('/notifications/post', async (req, res) => {
    console.log("Hello")
  try {
    const { description, link } = req.body;
    const doc = await new Notifications({
      description,
      link,
      postedAt: Date.now(),
    }).save();
    console.log("Hello1")

    req.io.emit('notification-changed', { type: 'created', notification: doc });
    res.status(200).json({ message: 'successFully updated' });
  } catch (err) {
    console.error(err)
    res.status(500).json({ errorMsg: 'Internal Server Error Please Try Again Later' });
  }
});

// GET ALL
router.get('/notifications/get', async (req, res) => {
  try {
    const notifications = await Notifications.find();
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ errorMsg: 'Internal server Error' });
  }
});

// DELETE BY ID
router.delete('/notification/delete/:Id', async (req, res) => {
  const { Id } = req.params;
  try {
    const doc = await Notifications.findByIdAndDelete(Id);
    if (doc) {
      req.io.emit('notification-changed', { type: 'deleted', notification: doc });
      res.status(200).json({ msg: "SuccessFully Deleted" });
    } else {
      res.status(404).json({ errorMsg: "Not Found" });
    }
  } catch (err) {
    res.status(500).json({ errorMsg: 'Internal server Error' });
  }
});

// DELETE ALL
router.delete('/notifications/delete', async (req, res) => {
  try {
    const result = await Notifications.deleteMany();
    req.io.emit('notification-changed', { type: 'cleared' });
    res.status(200).json({ msg: 'SuccessFully Deleted ' });
  } catch (err) {
    res.status(500).json({ errorMsg: "Internal server Error" });
  }
});

export default router;
