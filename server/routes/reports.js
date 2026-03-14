const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');

// @route   POST /api/reports
// @desc    Submit a new garbage report
// @access  Private (Citizen)
router.post('/', auth, async (req, res) => {
    try {
        const { garbageType, location, landmark, zone, description, photo, urgency } = req.body;

        const newReport = new Report({
            citizenId: req.user.id,
            garbageType,
            location,
            landmark,
            zone,
            description,
            photo,
            urgency,
            status: 'Pending'
        });

        const report = await newReport.save();
        res.json(report);
    } catch (err) {
        console.error('Report submission error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/reports
// @desc    Get all reports (with filters)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { zone, status, citizenId } = req.query;
        let query = {};

        if (zone) query.zone = zone;
        if (status) query.status = status;
        
        // If citizen, they only see their own reports by default if not specified
        if (req.user.role === 'citizen') {
            query.citizenId = req.user.id;
        } else if (citizenId) {
            query.citizenId = citizenId;
        }

        const reports = await Report.find(query).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        console.error('Fetch reports error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/reports/:id
// @desc    Get report by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id).populate('citizenId', 'name email phone');
        if (!report) return res.status(404).json({ message: 'Report not found' });
        res.json(report);
    } catch (err) {
        console.error('Fetch report details error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
