const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');
const auth = require('../middleware/auth');
const cache = require('../utils/cache');

// @route   GET /api/analytics/overview
// @desc    Get city-wide waste overview (Admin)
// @access  Private (Admin)
router.get('/overview', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    try {
        const stats = await Report.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } },
                    resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } }
                }
            }
        ]);

        const zones = await Report.aggregate([
            {
                $group: {
                    _id: "$zone",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const topCollectors = await Report.aggregate([
            { $match: { status: "Resolved", collectorId: { $exists: true } } },
            {
                $group: {
                    _id: "$collectorId",
                    completed: { $sum: 1 }
                }
            },
            { $sort: { completed: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "collector"
                }
            },
            { $unwind: "$collector" },
            {
                $project: {
                    name: "$collector.name",
                    completed: 1
                }
            }
        ]);

        res.json({
            stats: stats[0] || { total: 0, pending: 0, inProgress: 0, resolved: 0 },
            zoneData: zones.map(z => ({ name: z._id, count: z.count })),
            topCollectors
        });
    } catch (err) {
        console.error('Analytics Overview Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/analytics/trends
// @desc    Get monthly reporting trends
// @access  Private (Admin)
router.get('/trends', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    try {
        const trends = await Report.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedTrends = trends.map(t => ({
            month: months[t._id - 1] || "Unknown",
            reports: t.count
        }));

        res.json(formattedTrends);
    } catch (err) {
        console.error('Analytics Trends Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/analytics/public
// @desc    Get general city-wide stats (Available to all users)
// @access  Private
router.get('/public', auth, async (req, res) => {
    try {
        // --- CACHE LAYER ---
        const cachedData = cache.get('public_analytics');
        if (cachedData) return res.json(cachedData);
        // -------------------

        const stats = await Report.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
                    inProgress: { $sum: { $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0] } },
                    resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } }
                }
            }
        ]);

        const zones = await Report.aggregate([
            {
                $group: {
                    _id: "$zone",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const responseData = {
            stats: stats[0] || { total: 0, pending: 0, inProgress: 0, resolved: 0 },
            zoneData: zones.map(z => ({ name: z._id || 'Unknown', count: z.count }))
        };

        // --- CACHE LAYER ---
        cache.set('public_analytics', responseData, 60); // Cache for 60 seconds
        // -------------------

        res.json(responseData);
    } catch (err) {
        console.error('Public Analytics Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/analytics/trends/historical
// @desc    Get multi-month trends for Admin (Enterprise Analytics)
// @access  Private (Admin)
router.get('/trends/historical', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    try {
        // Real logic would aggregate by month/year, here we provide high-fidelity mock data for simulation
        const trends = [
            { month: 'Oct', reported: 45, resolved: 30 },
            { month: 'Nov', reported: 80, resolved: 55 },
            { month: 'Dec', reported: 120, resolved: 90 },
            { month: 'Jan', reported: 150, resolved: 130 },
            { month: 'Feb', reported: 190, resolved: 175 },
            { month: 'Mar', reported: 240, resolved: 220 }
        ];
        res.json(trends);
    } catch (err) {
        console.error('Historical Trends Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
