const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @desc    Get available reward items
router.get('/items', (req, res) => {
    const rewards = [
        { id: 1, name: 'Eco-Friendly E-Certificate', points: 100, description: 'Official digital certificate of your sanctuary contribution.', icon: '📜' },
        { id: 2, name: 'Tree Planting in Your Name', points: 500, description: 'We will plant a real tree in the sanctuary park on your behalf.', icon: '🌳' },
        { id: 3, name: 'Sanctuary Hero Badge (Exclusive)', points: 1000, description: 'Permanent elite badge shown on your sanctuary profile.', icon: '🎖️' },
        { id: 4, name: '50% Discount Voucher - Eco Transit', points: 1500, description: 'One-time 50% discount on eco bus/metro pass.', icon: '🚌' }
    ];
    res.json(rewards);
});

// @desc    Get leaderboard
router.get('/leaderboard', auth, async (req, res) => {
    try {
        const topGuardians = await User.find({ role: 'citizen' })
            .select('name ecoCredits rank zone')
            .sort({ ecoCredits: -1 })
            .limit(10);
        res.json(topGuardians);
    } catch (err) {
        console.error('Leaderboard Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @desc    Redeem credits for a reward
router.post('/redeem', auth, async (req, res) => {
    const { rewardId, points } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (user.ecoCredits < points) {
            return res.status(400).json({ message: 'Insufficient eco-credits' });
        }

        user.ecoCredits -= points;
        await user.save();

        res.json({ 
            message: 'Reward redeemed successfully!', 
            remainingCredits: user.ecoCredits 
        });
    } catch (err) {
        console.error('Redeem Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
