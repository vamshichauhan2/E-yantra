import express from 'express';
const router = express.Router();
import Project from '../Schema/projects.js';

// UPDATE project by Id
router.patch('/update/:Id', async (req, res) => {
  try {
    const { Id } = req.params;
    const updateData = req.body; // e.g., { status: 'in-progress' }

    let project = await Project.findById(Id);
    if (!project) {
      return res.status(404).json({ errorMsg: 'Project not found' });
    }

    Object.assign(project, updateData);
    project = await project.save();

    req.io.emit('project-changed', { type: 'updated', project });

    res.status(200).json({ message: 'Successfully updated', project });
  } catch (err) {
    
    res.status(500).json({ errorMsg: 'Internal Server Error Please Try Again Later' });
  }
});
router.delete('/delete/:Id', async (req, res) => {
  const { Id } = req.params;
  try {
    const project = await Project.findByIdAndDelete(Id);
    if (!project) {
      return res.status(404).json({ errorMsg: 'Not Found' });
    }

    req.io.emit('project-changed', { type: 'deleted', project });

    res.status(200).json({ msg: 'Successfully deleted' });
  } catch (err) {
    res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
});


// CREATE new project
router.post('/project/post', async (req, res) => {
  try {
    const projectData = req.body;

    const project = await new Project({
      ...projectData,
      createDate: Date.now()
    }).save();

    req.io.emit('project-changed', { type: 'created', project });
    res.status(200).json({ message: 'Successfully created', project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMsg: 'Internal Server Error Please Try Again Later' });
  }
});

// GET ALL projects
router.get('/project/get', async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (err) {
  
    res.status(500).json({ errorMsg: 'Internal Server Error' });
  }
});

// DELETE project BY ID


export default router;
