import express from 'express';
const router = express.Router();
import Event from '../Schema/event.js';
import Project from '../Schema/projects.js';



router.get('/chart-data', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 4; // last 5 years including current

    // Filter events within last 5 years and group by year
    const eventsByYear = await Event.aggregate([
      { 
        $match: { date: { $gte: new Date(`${startYear}-01-01`), $lte: new Date(`${currentYear}-12-31`) } } 
      },
      {
        $group: {
          _id: { $year: "$date" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Filter projects within last 5 years and group by year
    const projectsByYear = await Project.aggregate([
      {
        $match: { startDate: { $gte: new Date(`${startYear}-01-01`), $lte: new Date(`${currentYear}-12-31`) } }
      },
      {
        $group: {
          _id: { $year: "$startDate" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Prepare labels and counts aligned by year
    const labels = [];
    const eventCounts = [];
    const projectCounts = [];

    for (let y = startYear; y <= currentYear; y++) {
      labels.push(y.toString());

      const eventItem = eventsByYear.find(e => e._id === y);
      eventCounts.push(eventItem ? eventItem.count : 0);

      const projectItem = projectsByYear.find(p => p._id === y);
      projectCounts.push(projectItem ? projectItem.count : 0);
    }

    // Calculate overall growth compared to first year's count
    function calculateOverallGrowth(counts) {
      if (counts.length === 0) return [];
      const base = counts[0] || 1; // avoid division by zero; base at least 1
      return counts.map(count => ((count - base) / base) * 100);
    }

    const overallGrowth = calculateOverallGrowth(projectCounts);

    // Send response
    res.json({
      labels,
      eventConductionData: {
        labels,
        datasets: [{
          label: 'Events Conducted',
          data: eventCounts,
          borderColor: 'rgba(75,192,192,1)',
          fill: false,
        }],
      },
      projectsDoneData: {
        labels,
        datasets: [{
          label: 'Projects Done',
          data: projectCounts,
          backgroundColor: 'rgba(153,102,255,0.6)',
        }],
      },
      clubGrowthData: {
        labels,
        datasets: [{
          label: 'Overall Club Growth (%)',
          data: overallGrowth,
          backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF'],
        }],
      }
    });
  } catch (error) {
  
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
export default router