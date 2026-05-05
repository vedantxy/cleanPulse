const User = require('../models/User');

const calculateRank = (credits) => {
    if (credits >= 1000) return 'Earth Guardian';
    if (credits >= 500) return 'Forest Ranger';
    if (credits >= 100) return 'Sprout';
    return 'Seedling';
};

const awardCredits = async (userId, amount) => {
    try {
        const user = await User.findById(userId);
        if (!user) return null;

        user.ecoCredits += amount;
        user.rank = calculateRank(user.ecoCredits);
        
        await user.save();
        return user;
    } catch (err) {
        console.error('Award Credits Error:', err);
        throw err;
    }
};

module.exports = { calculateRank, awardCredits };
